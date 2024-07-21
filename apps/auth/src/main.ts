import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}))
  app.useLogger(app.get(Logger));
  app.enableCors({
    origin: 'http://localhost:3002', // Specify the origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Enable credentials
    allowedHeaders: 'Content-Type, Accept, Authorization', // Specify allowed headers as needed
  });
  app.use(cookieParser());
  const configService = app.get(ConfigService)
  console.log(configService.get('JWT_SECRET'))
  const port = configService.get<number>('AUTH_PORT') || 3001

  app.connectMicroservice({
    transport : Transport.TCP,
    options : {
       host:'0.0.0.0',
       port: configService.get('TCP_PORT')
    }
  })
  app.enableCors({
    origin: 'http://localhost:3000/register',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.startAllMicroservices()
  await app.listen(port,()=>{
     console.log(`Server is running on http://localhost:${port}`)
  });
}
bootstrap();
