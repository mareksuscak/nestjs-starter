import { Module } from '@nestjs/common';
import { CoreModule } from '@app/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@app/core/database/entities/user.entity';
import { HealthModule } from './health/health.module';
import { MailerModule } from '@app/core/mailer';

@Module({
  imports: [CoreModule, HealthModule, MailerModule, MikroOrmModule.forFeature([User])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
