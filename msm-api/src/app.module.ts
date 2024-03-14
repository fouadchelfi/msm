import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DbService } from './db';
import { AuthController, CategoriesController, ChargeNaturesController, ChargesController, CustomersController, EmployeeCreditsController, EmployeePaymentsController, EmployeesController, FamiliesController, IngredientsController, LosseNaturesController, LossesController, MoneySourceTransfersController, MoneySourcesController, PremisesController, PunchesController, PurchasesController, QuantityCorrectionsController, StatusTransfersController, StocksController, SuppliersController, UsersController } from './controllers';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from './utils';
import { ManagerService } from './services';

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
    FamiliesController,
    SuppliersController,
    CustomersController,
    EmployeesController,
    ChargeNaturesController,
    LosseNaturesController,
    StocksController,
    IngredientsController,
    ChargesController,
    LossesController,
    QuantityCorrectionsController,
    StatusTransfersController,
    PremisesController,
    MoneySourcesController,
    MoneySourceTransfersController,
    PunchesController,
    EmployeeCreditsController,
    EmployeePaymentsController,
    PurchasesController,
  ],
  providers: [
    AppService,
    DbService,
    JwtService,
    JwtStrategy,
    ManagerService,
  ],
})
export class AppModule { }