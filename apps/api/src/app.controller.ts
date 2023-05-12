import { MailerService } from '@app/core/mailer/mailer.service';
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly mailerService: MailerService) {}

  @Get()
  getHello(): string {
    this.mailerService.send();
    return this.appService.getHello();
  }
}
