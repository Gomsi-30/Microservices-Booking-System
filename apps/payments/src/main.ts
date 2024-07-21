import { NestFactory } from '@nestjs/core';
import { PaymentsModule } from './payments.module';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PAYMENT')
  app.connectMicroservice({
    transport:Transport.TCP,
    options:{
      host:'0.0.0.0',
      port:configService.get('PAYMENT_PORT')
    }
  })
  await app.startAllMicroservices()
  await app.listen(port,()=>{
    console.log('Server listening on port ' + port);
  });
}
bootstrap();
