import { createTransport } from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailerService {
  async send() {
    const transport = createTransport({
      url: 'smtp://localhost:1025',
    });

    const response = await transport.sendMail({
      to: 'marek@codelab303.com',
      from: 'noreply@example.com',
      text: 'Hello world!',
    });
  }
}
