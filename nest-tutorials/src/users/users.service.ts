import { 
  Headers,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import * as uuid from 'uuid';
import { ulid } from 'ulid';

import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';
import { UserInfo } from './UserInfo';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    private authService: AuthService,
    private emailService: EmailService,
    private dataSource: DataSource,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);

    if (!userExist) {
      throw new UnprocessableEntityException(
        'Unable to signup with this email address',
      );
    }

    const signupVerifyToken = uuid.v1();

    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { signupVerifyToken },
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email, password }
    })

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return this.authService.login({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }

  async getUserInfo(userId: string): Promise<UserInfo> {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    }
  }

  private async checkUserExists(emailAddress: string) {
    const user = await this.usersRepository.findOne({
      where: { email: emailAddress },
    });

    return user !== undefined;
  }

  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }

  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
