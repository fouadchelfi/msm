import { Controller, Get } from '@nestjs/common';
import { DbService } from './db';

@Controller('app')
export class AppController {
  constructor(private dbSchema: DbService) { }

  @Get('check-at-startup')
  async checkAtStartup() {
    await this.dbSchema.checkDb();
  }
}