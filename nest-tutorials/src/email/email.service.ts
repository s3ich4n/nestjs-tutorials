import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import { ConfigType } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import emailConfig from 'src/config/emailConfig';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor(
    @Inject(emailConfig.KEY) private config: ConfigType<typeof emailConfig>,
  ) {
    this.transporter = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.auth.user,
        pass: config.auth.pass,
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = this.config.baseUrl;
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '[s3ich4n] Signup verification email',
      html: `
        Press confirm button to verify your account.<br/>
        <form action="${url}" method="POST">
          <button>confirm</button>
        </form>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
