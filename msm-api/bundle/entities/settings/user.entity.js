"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_1 = require("../stock");
const purchases_1 = require("../purchases");
const sales_1 = require("../sales");
const hr_1 = require("../hr");
const production_1 = require("../production");
const treasuries_1 = require("../treasuries");
const purchase_entity_1 = require("../purchases/purchase.entity");
const distribution_entity_1 = require("../distributions/distribution.entity");
const distributions_1 = require("../distributions");
const quantity_correction_entity_1 = require("../stock/quantity-correction.entity");
let UserEntity = class UserEntity {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], UserEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], UserEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity, (entity) => entity.createdBy),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", Number)
], UserEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], UserEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity, (entity) => entity.lastUpdateBy),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", Number)
], UserEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_1.CategoryEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdCategories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_1.CategoryEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedCategories", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distributions_1.PremiseEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdPremises", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distributions_1.PremiseEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedPremises", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_1.FamilyEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdFamilies", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_1.FamilyEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedFamilies", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchases_1.SupplierEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdSuppliers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchases_1.SupplierEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedSuppliers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_1.CustomerEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdCustomers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_1.CustomerEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedCustomers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.EmployeeEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdEmployees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.EmployeeEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedEmployees", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => treasuries_1.MoneySourceEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdMoneySourceTransfers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => treasuries_1.MoneySourceEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedMoneySourceTransfers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_1.StockEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdStocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_1.StockEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedStocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quantity_correction_entity_1.QuantityCorrectionEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdQuantityCorrections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quantity_correction_entity_1.QuantityCorrectionEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedQuantityCorrections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_1.IngredientEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdIngredients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_1.IngredientEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedIngredients", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => treasuries_1.MoneySourceEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdMoneySources", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => treasuries_1.MoneySourceEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedMoneySources", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.PuncheEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdPunches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.PuncheEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedPunches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_entity_1.PurchaseEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdPurchases", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_entity_1.PurchaseEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedPurchases", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_1.SaleEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdSales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_1.SaleEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedSales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distribution_entity_1.DistributionEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdDistributions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distribution_entity_1.DistributionEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedDistributions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_1.BatchEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdBatches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_1.BatchEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedBatches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => treasuries_1.FenceEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdFences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => treasuries_1.FenceEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedFences", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_1.StatusTransferEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdStatusTransferStocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_1.StatusTransferEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedStatusTransferStocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.EmployeeCreditEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdEmployeeCredits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.EmployeeCreditEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedEmployeeCredits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.EmployeePaymentEntity, entity => entity.createdBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "createdEmployeePayments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.EmployeePaymentEntity, entity => entity.lastUpdateBy),
    __metadata("design:type", Array)
], UserEntity.prototype, "updatedEmployeePayments", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'users' })
], UserEntity);
//# sourceMappingURL=user.entity.js.map