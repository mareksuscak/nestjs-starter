import { Module } from '@nestjs/common';
import { CoreModule } from '@app/core';
import { MailerModule } from '@app/core/mailer';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [CoreModule, HealthModule, MetricsModule, MailerModule],
})
export class AppModule {}
