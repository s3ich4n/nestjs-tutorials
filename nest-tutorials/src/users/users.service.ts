import * as uuid from 'uuid';

import { Injectable } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';

@Injectable()
export class UsersService {
  constructor(private emailService: EmailService) {}

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    // todo
    //  1. 회원가입 처리중인 유저가 있으면 예외처리
    //  2. 로그인 상태가 되도록 토큰 발급

    throw new Error('method not implemented');
  }

  async login(email: string, password: string): Promise<string> {
    // todo
    //  1. email, password로 로그인 처리
    //  2. 토큰 발급
    throw new Error('method not implemented');
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    // todo
    //  1. userId를 가진 유저가 있나 확인. 없으면 에러
    //  2. 유저정보를 UserInfo 타입으로 리턴

    throw new Error('method not implemented');
  }

  private checkUserExists(email: string) {
    return false; // TODO 추후구현
  }

  private saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return; // TODO 추후구현
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
