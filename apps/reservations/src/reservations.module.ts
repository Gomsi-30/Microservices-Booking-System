import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { AUTH_SERVICE, DatabaseModule, PAYMENT_SERVICE } from '@app/common';
import { ReservationDocument, ReservationSchema } from './entities/reservation.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'Joi';
import { ReservationRepository } from './reservation.repository';
import { LoggerModule } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports:[LoggerModule,
    DatabaseModule,DatabaseModule.forFeature([{name: ReservationDocument.name,schema:ReservationSchema}]),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
         MONGO_URI: Joi.string().required(),
         RESERVATION_PORT: Joi.number().required(),
         TCP_PORT: Joi.number().required(),
         PAYMENT_PORT: Joi.number().required(),
      })
    }),
    ClientsModule.registerAsync([{
      name:PAYMENT_SERVICE,
      useFactory:(config:ConfigService)=>({
        transport:Transport.TCP,
        options:{
          host:'0.0.0.0',
          port:config.get('PAYMENT_PORT')
        }
      }),
      inject:[ConfigService] 
    }]),

    ClientsModule.registerAsync([
      {
        // Microservice client ka naam AUTH_SERVICE
        name: AUTH_SERVICE,

        // useFactory function jisse microservice client ka configuration return hota hai
        useFactory: (configService: ConfigService) => ({
          // TCP transport ka use karna communication ke liye
          transport: Transport.TCP,

          // Microservice ka host address
          options: {
            host: '0.0.0.0',

            // Microservice ka port number ConfigService se fetch karna
            port: configService.get<number>('TCP_PORT'),
          },
        }),

        // Dependencies specify karna jo useFactory mein inject hongi
        inject: [ConfigService],
      },
    ]),

  ],
  controllers: [ReservationsController],
  providers: [ReservationsService,ReservationRepository],
})
export class ReservationsModule {}
