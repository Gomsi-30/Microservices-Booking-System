import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ReservationsModule } from './reservations.module';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ReservationsModule, { abortOnError: true });
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.use(cookieParser())
  app.enableCors({
    origin: 'http://localhost:3000', // Specify the origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true, // Enable credentials
    allowedHeaders: 'Content-Type, Accept, Authorization', // Specify allowed headers as needed
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('RESERVATION_PORT') || 3000;
  app.useLogger(app.get(Logger))    // Log print hote h bs http req nahi
  console.log('TCP_PORT:', configService.get<number>('TCP_PORT'));
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap the application', error);
  process.exit(1); // Exit the process with an error code
});
