import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import * as Handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter: Transporter;

  constructor() {
    this.transporter = this.createTransporter();
  }

  private createTransporter(): Transporter {
    const { MAIL_HOST, MAIL_PORT, MAIL_SECURE, MAIL_USER, MAIL_PASS } =
      process.env;

    // Validate environment variables
    if (!MAIL_HOST || !MAIL_USER || !MAIL_PASS) {
      throw new InternalServerErrorException(
        'Email service configuration is missing required environment variables.',
      );
    }

    return createTransport({
      host: MAIL_HOST,
      port: parseInt(MAIL_PORT, 10) || 587, // Default to 587 if MAIL_PORT is not set
      secure: MAIL_SECURE === 'true', // Use secure connection if specified
      auth: {
        user: MAIL_USER,
        pass: MAIL_PASS,
      },
    });
  }

  private compileTemplate(templateName: string, context: any): string {
    // Update to point to the correct template directory
    const filePath = join(
      __dirname,
      '..',
      'email',
      'template',
      `${templateName}.hbs`,
    );

    try {
      const source = readFileSync(filePath, 'utf8');
      const template = Handlebars.compile(source);
      return template(context);
    } catch (error) {
      this.logger.error(`Error reading template: ${filePath}`, error);
      throw new InternalServerErrorException('Template rendering failed');
    }
  }

  async sendMail(
    to: string,
    subject: string,
    templateName: string,
    context: any,
  ): Promise<void> {
    try {
      const html = this.compileTemplate(templateName, context);

      // Set the sender's name and email
      const senderName = 'Online-Food'; // Change this to your desired name
      const senderEmail = process.env.MAIL_FROM || process.env.MAIL_USER;

      const mailOptions = {
        from: `"${senderName}" <${senderEmail}>`, // Format: "Name" <email>
        to,
        subject,
        html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent: ${info.messageId}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
