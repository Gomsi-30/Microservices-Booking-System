import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const config = app.get(ConfigService)
  app.connectMicroservice({
    transport:Transport.TCP,
    options:{
      host:'0.0.0.0',
      port:config.get('NOTIFICATION_PORT')
    }
  })
  console.log('Server is running on port ' + config.get('NOTIFICATION_PORT'))
  await app.startAllMicroservices();
}
bootstrap();
