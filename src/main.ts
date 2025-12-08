import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { SocketIoAdapter } from '@/global/socket.adapter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.set('trust proxy', true);

  app.use(
    express.json({
      limit: '150mb',
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.useWebSocketAdapter(new SocketIoAdapter(app));

  const whitelist = getCors();

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.error(`[CORS] Origem "${origin}" RECUSADA.`);
        callback(new Error('Não permitido pelo CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const config = new DocumentBuilder()
      .setTitle('Template - Backend')
      .setDescription('Essa API descreve as operações do sistema do Backend Template.')
      .setVersion('1.0')
      .addSecurity('bearerAuth', {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      })
      .build();

    const document = SwaggerModule.createDocument(app, config);

    app.use(
      '/docs',
      apiReference({
        theme: 'light',
        darkMode: true,
        layout: 'sidebar',
        spec: {
          content: document,
        },
      }),
    );
  }

  function getCors(): string[] {
    const corsEnv = process.env.CORS;
    if (!corsEnv) {
      return ['http://localhost:5173'];
    }
    return corsEnv.split(',');
  }

  await app.listen(process.env.PORT ?? 3000);

  console.info(`Server is running on http://localhost:${process.env.PORT ?? 3000}`);
  console.info(
    `Scalar(OpenAPI) is running on http://localhost:${process.env.PORT || 3000}/docs`,
  );
  console.info(`Prisma Studio is running on http://localhost:${process.env.PORT || 5555}`);

  console.info('CORS liberado para:', getCors());
}

void bootstrap();
