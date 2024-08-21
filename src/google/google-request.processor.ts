import { OnQueueError, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { GoogleProcess } from './enums/google.process.enum';

@Processor('google-request-queue')
export class GoogleRequestProcessor {
  private readonly logger = new Logger(GoogleRequestProcessor.name);
  @Process(GoogleProcess.EXPORT_SOCIAL_PASSPORTS)
  async handleJob(job: Job) {}

  @OnQueueFailed()
  async onQueueFailed(job: Job, error: any) {
    this.logger.error(`Task ${job.id} failed: ${error.message}`, error.stack);
  }

  @OnQueueError()
  async onQueueError(error: any) {
    this.logger.error(error);
  }
}
