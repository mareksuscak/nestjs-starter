import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  @Cron(CronExpression.EVERY_SECOND)
  handleCron() {
    this.logger.debug('Called every second');
  }
}
