import { DatabaseModule, NOTIFICATION_SERVICE } from '@app/common';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { UsersDocument, UsersSchema } from './entity/users.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([{
      name: NOTIFICATION_SERVICE,
      useFactory : (config : ConfigService)=>({
      transport:Transport.TCP,
      options:{
        host:'0.0.0.0',
        port : config.get<number>('NOTIFICATION_PORT')
      }
     }),
     inject:[ConfigService]
    }]),
    DatabaseModule,
    DatabaseModule.forFeature([
      { name: UsersDocument.name, schema: UsersSchema },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersRepository, UsersService],
  exports: [UsersService],
})
export class UsersModule {}
