import { Injectable, Logger } from '@nestjs/common';
import { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: process.env.MAIL_HOST, // Your SMTP server host
      port: parseInt(process.env.MAIL_PORT, 10), // Your SMTP server port
      secure: process.env.MAIL_SECURE === 'true', // True for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER, // Your SMTP user
        pass: process.env.MAIL_PASS, // Your SMTP password
      },
    });
  }

  private async compileTemplate(
    templateName: string,
    context: any,
  ): Promise<string> {
    const filePath = join(__dirname, 'templates', `${templateName}.hbs`);
    const source = readFileSync(filePath, 'utf8'); // Shablon faylini o'qish
    const template = Handlebars.compile(source); // Shablonni kompilatsiya qilish
    return template(context); // Kontekstni shablonga qo'shish
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ): Promise<void> {
    try {
      const html = await this.compileTemplate(templateName, context); // HTMLni tayyorlash

      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM, // Sender address
        to,
        subject,
        html, // HTML xabar
      });
      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new Error('Failed to send email');
    }
  }
}
