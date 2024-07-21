import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { AUTH_SERVICE, LoggerModule, NOTIFICATION_SERVICE } from '@app/common';
import { JwtModule } from '@nestjs/jwt';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './Strategy/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './Strategy/jwt.strategy';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
   
    PassportModule,
    UsersModule,
    LoggerModule,
    ConfigModule.forRoot({
      // envFilePath: '.env',
      isGlobal: true,
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        AUTH_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
        NOTIFICATION_PORT:Joi.number().required(),
      }),
    }),

   

    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        global:true,
        secret:configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION')}s`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
 
})
export class AuthModule {};
