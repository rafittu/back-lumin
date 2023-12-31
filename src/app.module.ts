import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { UserModule } from './modules/user/user.module';
import * as Joi from 'joi';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { JwtAuthGuard } from './modules/auth/infra/guards/jwt-auth-.guard';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { RecordModule } from './modules/record/record.module';
import { PaymentsModule } from './modules/payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_HOST_CONTAINER: Joi.string().required(),
        SIGNUP_PATH: Joi.string().required(),
        SIGNIN_PATH: Joi.string().required(),
        GET_ME_PATH: Joi.string().required(),
        GET_USER_PATH: Joi.string().required(),
        UPDATE_USER_PATH: Joi.string().required(),
        REDIS_HOST_CONTAINER: Joi.string().required(),
        REDIS_CONFIG_HOST: Joi.string().required(),
        REDIS_CONFIG_PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        RECORD_CIPHER_ALGORITHM: Joi.string().required(),
        RECORD_CIPHER_KEY: Joi.string().required(),
        RECORD_CIPHER_IV: Joi.string().required(),
        NEW_CIPHER_KEY: Joi.optional(),
        NEW_CIPHER_IV: Joi.optional(),
        ADMIN_SIGNUP_TOKEN: Joi.string().required(),
      }),
    }),
    UserModule,
    AuthModule,
    SchedulerModule,
    RecordModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
