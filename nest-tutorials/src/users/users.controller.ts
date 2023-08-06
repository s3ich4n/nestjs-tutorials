import {
  Body,
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Logger,
  LoggerService,
  Post,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
  Inject,
  InternalServerErrorException,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { SchedulerRegistry } from '@nestjs/schedule';

@Controller('users')
export class UsersController {
  constructor(
    @Inject(Logger) private readonly logger: LoggerService,
    private usersService: UsersService,
    private scheduler: SchedulerRegistry,
  ) {}

  @Post()
  async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
    this.printLoggerServiceLog(dto);

    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  @HttpCode(200)
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    console.log(dto);
    const { signupVerifyToken } = dto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  @HttpCode(200)
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;
    return await this.usersService.login(email, password);
  }

  @UseGuards(AuthGuard)
  @Get('/:id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    if (+userId < 1) {
      throw new BadRequestException(
        'id is greater than 0',
        'id format exception',
      );
    }
    return await this.usersService.getUserInfo(userId);
  }

  @Post('/start')
  async start() {
    const job = this.scheduler.getCronJob('cronSample');

    job.start();
    console.log(`started at ${job.lastDate()}`);
  }

  @Post('/stop')
  async stop() {
    const job = this.scheduler.getCronJob('cronSample');

    job.stop();
    console.log(`stopped at ${job.lastDate()}`);
  }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.logger.error('error: ' + JSON.stringify(dto), e.stack);
    }

    this.logger.warn('warn: ' + JSON.stringify(dto));
    this.logger.log('log: ' + JSON.stringify(dto));
    this.logger.verbose('verbose: ' + JSON.stringify(dto));
    this.logger.debug('debug: ' + JSON.stringify(dto));
  }
}
