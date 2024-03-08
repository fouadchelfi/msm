import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

bootstrap();

// const { app } = require('electron');

// app.whenReady().then(() => {
//   bootstrap();
// })

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// })