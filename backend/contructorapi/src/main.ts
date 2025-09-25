import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import * as express from 'express';
import { join } from 'path';
import * as session from 'express-session';

async function bootstrap() {
  // Load environment variables from .env file
  dotenv.config();

  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Use cookie parser middleware
  app.use(cookieParser());

  app.use(
    session({
      secret: 'your_secret_key',
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 3600000 }, // 1 hour
    }),
  );

  // Global validation pipe for validation across all routes
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // CORS Configuration (Crucial for connecting to your React frontend)
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5173']; // Default if environment variable not set

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow requests from allowed origins
      } else {
        callback(new Error('Not allowed by CORS')); // Reject requests from disallowed origins
      }
    },
    credentials: true, // Allow cookies to be sent
  });

  // Serve uploaded images from 'uploads' folder
  const uploadsPath = join(__dirname, '..', 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Start the application on the specified port
  const port = process.env.PORT || 3000; // Default to port 3000 if not provided
  await app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

bootstrap();
