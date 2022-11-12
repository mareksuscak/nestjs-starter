import { Module } from '@nestjs/common';
import { CoreModule } from '@app/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '@app/core/database/entities/user.entity';
import { HealthController } from './health/health.controller';

@Module({
  imports: [CoreModule, MikroOrmModule.forFeature([User])],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
