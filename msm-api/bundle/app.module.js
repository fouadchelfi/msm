"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const typeorm_1 = require("@nestjs/typeorm");
const db_1 = require("./db");
const controllers_1 = require("./controllers");
const jwt_1 = require("@nestjs/jwt");
const utils_1 = require("./utils");
const services_1 = require("./services");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: 'localhost',
                port: 5433,
                username: 'postgres',
                password: '0000',
                database: 'msm_db',
                entities: [`${__dirname}/entities/**/*.entity.{js,ts}`],
                synchronize: false,
            }),
            jwt_1.JwtModule.register({
                secret: 'super-secret-cat',
            }),
        ],
        controllers: [
            app_controller_1.AppController,
            controllers_1.UsersController,
            controllers_1.AuthController,
            controllers_1.CategoriesController,
            controllers_1.FamiliesController,
            controllers_1.SuppliersController,
            controllers_1.CustomersController,
            controllers_1.EmployeesController,
            controllers_1.ChargeNaturesController,
            controllers_1.LosseNaturesController,
            controllers_1.StocksController,
            controllers_1.IngredientsController,
            controllers_1.ChargesController,
            controllers_1.LossesController,
            controllers_1.QuantityCorrectionsController,
            controllers_1.StatusTransfersController,
            controllers_1.PremisesController,
            controllers_1.MoneySourcesController,
            controllers_1.MoneySourceTransfersController,
            controllers_1.PunchesController,
            controllers_1.EmployeeCreditsController,
            controllers_1.EmployeePaymentsController,
            controllers_1.PurchasesController,
            controllers_1.SalesController,
            controllers_1.DistributionsController,
            controllers_1.PremiseReturnsController,
            controllers_1.BatchesController,
            controllers_1.FencesController,
            controllers_1.StatsController
        ],
        providers: [
            app_service_1.AppService,
            db_1.DbService,
            jwt_1.JwtService,
            utils_1.JwtStrategy,
            services_1.ManagerService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map