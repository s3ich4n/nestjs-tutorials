import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from './config/validationSchema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';
import emailConfig from './config/emailConfig';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    EmailModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.env.${process.env.NODE_ENV}`],
      load: [emailConfig],
      isGlobal: true,
      validationSchema,
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: 3306,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false, // ‼ 주의 ‼
      migrations: [__dirname + '/**/migrations/*{.ts,.js}'],
      migrationsRun: false,
      migrationsTableName: 'migrations',
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
