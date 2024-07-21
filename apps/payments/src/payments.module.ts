import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'Joi';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_SERVICE } from '@app/common';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema:Joi.object({
      PAYMENT_PORT: Joi.string().required(),
      PAYMENT: Joi.string().required(),
      STRIPE_KEY: Joi.string().required(),
      NOTIFICATION_PORT: Joi.number().required(),
    })
  }),
   ClientsModule.registerAsync([{
      name: NOTIFICATION_SERVICE,
      useFactory:(configService:ConfigService)=>({
         transport:Transport.TCP,
         options:{
          host:'0.0.0.0',
          port:configService.get('NOTIFICATION_PORT')
         }
      }),
      inject:[ConfigService]
   }])
],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
