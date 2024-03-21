import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const { app } = require('electron');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
}

// bootstrap();

app.whenReady().then(() => {
  bootstrap();
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})