import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db';
import { AuthController, CategoriesController, ChargeNaturesController, CustomersController, LosseNaturesController, SuppliersController, UsersController } from './controllers';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './utils';
import { EmployeesController } from './controllers/hr';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres',
      password: '0000',
      database: 'msm_db',
      entities: [`${__dirname}/entities/**/*.entity.{js,ts}`],
      synchronize: false,
    }),
    JwtModule.register({
      secret: 'super-secret-cat',
    }),
  ],
  controllers: [
    AppController,
    UsersController,
    AuthController,
    CategoriesController,
    SuppliersController,
    CustomersController,
    EmployeesController,
    ChargeNaturesController,
    LosseNaturesController,
  ],
  providers: [
    AppService,
    DbService,
    JwtService,
    JwtStrategy
  ],
})
export class AppModule { }
