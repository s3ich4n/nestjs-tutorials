import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import { Injectable } from '@nestjs/common';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'houkai1018@gmail.com',
        pass: 'nerzftakslgwcxki', // 이 부분에 앱 비밀번호를 사용한다!
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000';
    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`;
    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '[s3ich4n] Signup verification email',
      html: `
        Press confirm button to verify your account.<br/>
        <form action="${url}" method="POST>
          <button>confirm</button>
        </form>
      `,
    };

    return await this.transporter.sendMail(mailOptions);
  }
}
