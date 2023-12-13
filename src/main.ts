import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Env } from './env';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  app.use(
    cors({
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
      credentials: true,
    }),
  );

  const configService = app.get<ConfigService<Env>>(ConfigService);
  const port = configService.get<number>('PORT', { infer: true });

  app.setGlobalPrefix('v200');

  await app.listen(port);
  const url = await app.getUrl();
  console.log(`Application is running on: ${url}`);
}

bootstrap();
