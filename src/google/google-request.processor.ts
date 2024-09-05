import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { GoogleProcess } from './enums/google.process.enum';
import { GoogleService } from './google.service';
import { Group } from '../groups/entities/group.entity';
import { SocialPassportService } from '../social-passport/social-passport.service';
import { SocialPassportExportConfigService } from '../social-passport/social-passport-export-config.service';
import { GoogleModule } from './google.module';
import { In } from 'typeorm';
import { SocialPassportModule } from '../social-passport/social-passport.module';

@Processor('google-request-queue')
export class GoogleRequestProcessor {
  constructor(
    private readonly googleService: GoogleService,
    @Inject(forwardRef(() => SocialPassportService))
    private readonly socialPassportService: SocialPassportService,
    private readonly exportConfigService: SocialPassportExportConfigService,
  ) {}
  private readonly logger = new Logger(GoogleRequestProcessor.name);

  @Process(GoogleProcess.EXPORT_SOCIAL_PASSPORTS)
  async handleExport(job: Job<{ group: Group; spreadsheetId: string }>) {
    const { group, spreadsheetId } = job.data;
    const fieldOrder = this.exportConfigService.getFieldOrder();
    const headers = this.exportConfigService.getHeaders();

    const passports = await this.socialPassportService.findGroupsPassports(
      group.id,
    );
    const dataToExport = passports.map((passport) =>
      this.socialPassportService.preparePassportData(passport),
    );

    await this.googleService.exportGroupPassports(
      spreadsheetId,
      group.name,
      headers,
      fieldOrder,
      dataToExport,
      this.exportConfigService,
    );
  }

  @Process(GoogleProcess.FORMAT_SOCIAL_PASSPORTS)
  async handleFormat(job: Job<{ sheetName: string; spreadsheetId: string }>) {
    await this.googleService.formatSheet(
      job.data.sheetName,
      job.data.spreadsheetId,
    );
  }

  @OnQueueFailed()
  async onQueueFailed(job: Job, error: any) {
    this.logger.error(`Task ${job.id} failed: ${error.message}`, error.stack);
  }

  @OnQueueError()
  async onQueueError(error: any) {
    this.logger.error(error);
  }
}
