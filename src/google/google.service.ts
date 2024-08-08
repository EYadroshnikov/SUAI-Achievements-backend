import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google, sheets_v4 } from 'googleapis';

@Injectable()
export class GoogleService {
  constructor(private readonly configService: ConfigService) {}
  getAuth() {
    return new google.auth.GoogleAuth({
      credentials: this.configService.get('google.credentials'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  getSheets(auth) {
    return google.sheets({ version: 'v4', auth });
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
  }

  async updateSheet(
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
}
