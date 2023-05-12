import { Module } from '@nestjs/common';
import { CoreModule } from '@app/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@app/core/database/entities/user.entity';
import { MailerModule } from '@app/core/mailer';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';

@Module({
  imports: [CoreModule, HealthModule, MetricsModule, MailerModule, MikroOrmModule.forFeature([User])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
