import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './src/app.module';
import * as fs from 'fs';

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Cycluno API')
    .setDescription('AI-Powered Test Case Design, Execution & Bug Tracking')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer('http://localhost:3001', 'Local Development')
    .addServer('https://cycluno.onrender.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2));
  
  console.log('swagger.json generated successfully!');
  process.exit(0);
}

generateSwagger();