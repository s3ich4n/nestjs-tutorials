import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Param,
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './UserInfo';
import { UsersService } from './users.service';
import { VerifyEmailDto } from './dto/verify-email.dto';


@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
  ) {}

  @Post()
  async createUser(@Body(ValidationPipe) dto: CreateUserDto): Promise<void> {
    console.log(dto);
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
    return await this.usersService.getUserInfo(userId);
  }
}
