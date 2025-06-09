import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';
import * as fs from 'fs'; // Import the Node.js file system module

async function bootstrap() {
  // --- THIS IS THE CRITICAL FIX ---
  // Define the path for the uploads directory
  const uploadsDir = join(process.cwd(), 'public', 'uploads');

  // Check if the directory exists, and create it if it doesn't
  if (!fs.existsSync(uploadsDir)) {
    console.log(`Uploads directory not found. Creating it at: ${uploadsDir}`);
    // `recursive: true` ensures that both 'public' and 'uploads' can be created if needed
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  // --- END OF FIX ---

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  // Serve the static files from the now-guaranteed-to-exist folder
  app.use('/uploads', express.static(join(process.cwd(), 'public', 'uploads')));

  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: http://localhost:3000`);
}
bootstrap();