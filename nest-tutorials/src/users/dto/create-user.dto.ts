import { BadRequestException } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
} from 'class-validator';
import { NotIn } from 'src/utils/decorators/not-in';

export class CreateUserDto {
  @Transform(params => params.value.trim())
  @NotIn('password', { message: 'password should not contain name.'})
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @Transform(({ value, obj }) => {
    if (obj.password.includes(obj.name.trim())) {
      throw new BadRequestException("password should not contain name.")
    }
    return value.trim();
  })
  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
