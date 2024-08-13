import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sheets, sheets_v4 } from '@googleapis/sheets';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class GoogleService {
  constructor(private readonly configService: ConfigService) {}
  getAuth() {
    return new GoogleAuth({
      credentials: this.configService.get('google.credentials'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  getSheets(auth) {
    return sheets({ version: 'v4', auth });
  }

  async clearSheet(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetName: string,
  ) {
    try {
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: `${sheetName}`,
      });
    } catch (error) {
      if (error.code === 400) {
        // Handle case where the sheet doesn't exist yet
        await this.addSheet(sheets, spreadsheetId, sheetName);
      } else {
        throw error;
      }
    }
  }

  async addSheet(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetName: string,
  ) {
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetName,
              },
            },
          },
        ],
      },
    });
    await this.formatCells(sheets, spreadsheetId, sheetName);
  }

  async updateSocialPassportSheet(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetName: string,
    values: any[][],
  ) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `${sheetName}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });
  }

  async getSheetId(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetName: string,
  ): Promise<number> {
    const sheet = await sheets.spreadsheets.get({
      spreadsheetId,
      ranges: [],
      includeGridData: false,
    });

    const foundSheet = sheet.data.sheets?.find(
      (s) => s.properties?.title === sheetName,
    );

    if (!foundSheet || !foundSheet.properties?.sheetId) {
      throw new Error(`Sheet with name "${sheetName}" not found`);
    }

    return foundSheet.properties.sheetId;
  }

  async formatCells(
    sheets: sheets_v4.Sheets,
    spreadsheetId: string,
    sheetName: string,
  ) {
    const sheetId = await this.getSheetId(sheets, spreadsheetId, sheetName);
    const columnWidths: number[] = [
      250, // ФИО
      125, // Номер группы
      125, // Телефон
      210, // VK
      210, // Telegram
      125, // Бюджет/контракт
      250, // Регион
      200, // Социальная категория
      125, // Статус БСК
      180, // Постановка на мед. учёт
      180, // Постановка на воинский учёт
      180, // Получение пропуска
      180, // Получение студенческого билета
      180, // Оформление льготного БСК
      180, // Заполнение заявления в профком
      180, // Получение профсоюзного билета
      180, // Получение стипендиальной карты
      250, // Сдача оригинала аттестата/подписание договора
      250, // Прохождение тестов Центра Компетенций
      150, // Роль в группе
      250, // Хобби
      300, // Принадлежность к органам студенческого самоуправления
      250, // Что умеет делать профессионально
      250, // Created At
      250, // Updated At
    ];
    const requests: sheets_v4.Schema$Request[] = [
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 0,
            endRowIndex: 1,
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
              verticalAlignment: 'MIDDLE',
              textFormat: {
                bold: true,
              },
              wrapStrategy: 'WRAP', // Заголовки без переноса текста
            },
          },
          fields:
            'userEnteredFormat(horizontalAlignment,verticalAlignment,textFormat,wrapStrategy)',
        },
      },
      {
        repeatCell: {
          range: {
            sheetId,
            startRowIndex: 1,
          },
          cell: {
            userEnteredFormat: {
              wrapStrategy: 'WRAP', // Перенос текста для всех значений
            },
          },
          fields: 'userEnteredFormat(wrapStrategy)',
        },
      },
    ];

    // Добавляем запросы для установки ширины столбцов
    columnWidths.forEach((width, index) => {
      requests.push({
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: 'COLUMNS',
            startIndex: index,
            endIndex: index + 1,
          },
          properties: {
            pixelSize: width,
          },
          fields: 'pixelSize',
        },
      });
    });

    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests,
      },
    });
  }
}
