import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { validationSchema } from './config/validationSchema';
import emailConfig from './config/emailConfig';
import authConfig from './config/authConfig';
import { UsersModule } from './users/users.module';
import { ExceptionModule } from './exception/exception.module';
import { LoggingModule } from './logging/logging.module';
import { BatchModule } from './batch/batch.module';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { DogHealthIndicator } from './healthcheck/dog.health';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: [`${__dirname}/config/env/.env.${process.env.NODE_ENV}`],
      load: [emailConfig, authConfig],
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
    ExceptionModule,
    LoggingModule,
    BatchModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthcheckController],
  providers: [DogHealthIndicator],
})
export class AppModule {}
