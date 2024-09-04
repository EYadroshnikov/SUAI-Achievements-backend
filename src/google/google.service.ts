import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sheets, sheets_v4 } from '@googleapis/sheets';
import { GoogleAuth } from 'google-auth-library';
import { SocialPassportDto } from '../social-passport/dtos/social-passport.dto';
import { IExportConfigService } from './interfaces/export-config-service.interface';
import { Group } from '../groups/entities/group.entity';
import { GoogleProcess } from './enums/google.process.enum';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class GoogleService {
  auth: GoogleAuth;
  sheets: sheets_v4.Sheets;
  constructor(
    private readonly configService: ConfigService,
    @InjectQueue('google-request-queue') private googleRequestQueue: Queue,
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
}
