import { Injectable, Logger } from '@nestjs/common';
import nodemailer, { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';

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

  async sendMail(
    to: string,
    subject: string,
    text: string,
    html?: string,
  ): Promise<void> {
    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM, // Sender address
        to,
        subject,
        text,
        html,
      });
      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new Error('Failed to send email');
    }
  }
}
