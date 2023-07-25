import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async login(id: string, name: string, email: string): Promise<string> {
    // 쉽게짜기
    // DB에 똑같이 쿼리해서 값 갖고오기
    // 일단 라이브러리 찾기
    // JWT 토큰 관련 처리하기
  }
}
