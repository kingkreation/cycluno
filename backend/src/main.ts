import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Cycluno API')
    .setDescription('AI-Powered Test Case Design, Execution & Bug Tracking')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3001', 'Local Development')
    .addServer('https://cycluno.onrender.com', 'Production')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  
  // Setup Swagger UI
  SwaggerModule.setup('api/docs', app, document);

  // Save swagger.json to file (optional, for local development)
  if (process.env.NODE_ENV !== 'production') {
    fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
    console.log('📄 swagger.json saved to ./swagger.json');
  }

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Cycluno Backend running on port ${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api/docs`);
  console.log(`📄 Swagger JSON: http://localhost:${port}/api/docs-json`);
}
bootstrap();