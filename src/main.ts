import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import { DocumentBuilder } from '@nestjs/swagger/dist/document-builder';
import { SwaggerModule } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('My-API')
    .setDescription('my first web application')
    .setVersion('1.0')
    .addTag('')
    .addBearerAuth(
      {
        scheme: 'bearer',
        bearerFormat: 'JWT',
        type: 'http'
      },
      'Authorization'
    )
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(process.env.PORT ?? 3000);
  
  
}
bootstrap();

