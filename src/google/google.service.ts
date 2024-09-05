import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sheets, sheets_v4 } from '@googleapis/sheets';
import { GoogleAuth } from 'google-auth-library';
import { IExportConfigService } from './interfaces/export-config-service.interface';
import { Group } from '../groups/entities/group.entity';
import { GoogleProcess } from './enums/google.process.enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SocialPassportExportConfigService } from '../social-passport/social-passport-export-config.service';

@Injectable()
export class GoogleService {
  auth: GoogleAuth;
  sheets: sheets_v4.Sheets;
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('google-request-queue') private googleRequestQueue: Queue,
    private readonly exportConfigService: SocialPassportExportConfigService,
  ) {
    this.auth = new GoogleAuth({
      credentials: this.configService.get('google.credentials'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    this.sheets = sheets({ version: 'v4', auth: this.auth });
  }

  async exportGroupPassports(
    spreadsheetId: string,
    sheetName: string,
    headers: string[],
    fieldOrder: string[],
    dataToExport: any[],
    exportConfigService: IExportConfigService,
  ) {
    // Ensure sheet exists
    await this.ensureSheetExists(spreadsheetId, sheetName);
    // Clear the sheet
    await this.clearSheet(spreadsheetId, sheetName);

    // Prepare data
    const rows = [
      headers,
      ...dataToExport.map((data) =>
        fieldOrder.map((field) =>
          exportConfigService.translateField(field, data[field]),
        ),
      ),
    ];

    // Write data to sheet
    await this.writeDataToSheet(spreadsheetId, sheetName, rows);
  }

  async ensureSheetExists(spreadsheetId: string, sheetName: string) {
    const sheetMetadata = await this.sheets.spreadsheets.get({ spreadsheetId });
    const sheet = sheetMetadata.data.sheets.find(
      (s) => s.properties.title === sheetName,
    );

    if (!sheet) {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: { title: sheetName },
              },
            },
          ],
        },
      });
    }
  }

  async clearSheet(spreadsheetId: string, sheetName: string) {
    await this.sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: sheetName,
    });
  }

  async writeDataToSheet(spreadsheetId: string, sheetName: string, rows) {
    await this.sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: { values: rows },
    });
  }

  async exportGroup(group: Group, spreadsheetId: string) {
    await this.googleRequestQueue.add(GoogleProcess.EXPORT_SOCIAL_PASSPORTS, {
      group,
      spreadsheetId,
    });
  }

  async formatSheet(sheetName: string, spreadsheetId: string) {
    await this.googleRequestQueue.add(GoogleProcess.FORMAT_SOCIAL_PASSPORTS, {
      spreadsheetId,
      sheetName,
    });
  }

  async getSheetId(spreadsheetId: string, sheetName: string): Promise<number> {
    const sheetMetadata = await this.sheets.spreadsheets.get({ spreadsheetId });
    const sheet = sheetMetadata.data.sheets.find(
      (s) => s.properties.title === sheetName,
    );

    return sheet?.properties?.sheetId;
  }

  async processFormatSheet(sheetName: string, spreadsheetId: string) {
    const columnWidths = [
      250, // Ширина для 'ФИО'
      230, // Ширина для 'Электронная почта'
      150, // Ширина для 'Телефон'
      180, // Ширина для 'VK'
      180, // Ширина для 'Telegram'
      80, // Ширина для 'Пол'
      120, // Ширина для 'Дата рождения'
      100, // Ширина для 'Основа обучения'
      100, // Ширина для 'Иностранец'
      150, // Ширина для 'Регион'
      150, // Ширина для 'Предыдущее образование'
      100, // Ширина для 'Доступ к личному кабинету и LMS'
      100, // Ширина для 'Конкурентный балл'
      200, // Ширина для 'Социальные категории'
      100, // Ширина для 'БСК'
      150, // Ширина для 'Мед. учет'
      150, // Ширина для 'Воинский учет'
      100, // Ширина для 'Пропуск'
      100, // Ширина для 'Студенческий билет'
      150, // Ширина для 'Льготный БСК'
      100, // Ширина для 'Заявление в профком'
      180, // Ширина для 'СКС РФ'
      100, // Ширина для 'Стипендиальная карта'
      150, // Ширина для 'Общежитие'
      100, // Ширина для 'Тесты ЦК'
      150, // Ширина для 'Роль в группе'
      300, // Ширина для 'Хобби'
      200, // Ширина для 'Студии'
      300, // Ширина для 'Хард-скиллы'
      180, // Ширина для 'Обновлено'
      180, // Ширина для 'Создано'
    ];

    const sheetId = await this.getSheetId(spreadsheetId, sheetName);

    const booleanFields = this.exportConfigService
      .getFieldOrder()
      .map((field, index) =>
        this.exportConfigService.fieldTypes[field] === 'boolean' ? index : -1,
      )
      .filter((index) => index !== -1);

    const requests = [
      ...columnWidths.map((width, index) => ({
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: 'COLUMNS',
            startIndex: index, // Индекс колонки
            endIndex: index + 1,
          },
          properties: {
            pixelSize: width, // Ширина колонки
          },
          fields: 'pixelSize',
        },
      })),
      ...booleanFields.flatMap((index) => [
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [
                {
                  sheetId,
                  startRowIndex: 1, // Пропускаем первую строку (заголовки)
                  startColumnIndex: index,
                  endColumnIndex: index + 1,
                },
              ],
              booleanRule: {
                condition: {
                  type: 'TEXT_EQ',
                  values: [{ userEnteredValue: 'Да' }],
                },
                format: {
                  backgroundColor: { red: 0.741, green: 0.839, blue: 0.675 }, // Зеленый фон
                },
              },
            },
            index: 0,
          },
        },
        {
          addConditionalFormatRule: {
            rule: {
              ranges: [
                {
                  sheetId,
                  startRowIndex: 1, // Пропускаем первую строку (заголовки)
                  startColumnIndex: index,
                  endColumnIndex: index + 1,
                },
              ],
              booleanRule: {
                condition: {
                  type: 'TEXT_EQ',
                  values: [{ userEnteredValue: 'Нет' }],
                },
                format: {
                  backgroundColor: { red: 0.874, green: 0.616, blue: 0.608 }, // Красный фон
                },
              },
            },
            index: 0,
          },
        },
      ]),
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0, // Первая строка с заголовками
            endRowIndex: 1, // Только первая строка
          },
          cell: {
            userEnteredFormat: {
              textFormat: {
                bold: true, // Устанавливаем жирный шрифт
              },
            },
          },
          fields: 'userEnteredFormat.textFormat.bold',
        },
      },
    ];

    await this.sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: { requests },
    });
  }
}
