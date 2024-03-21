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
exports.MoneySourceEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const hr_1 = require("../hr");
const money_source_transfer_entity_1 = require("./money-source-transfer.entity");
const purchase_entity_1 = require("../purchases/purchase.entity");
const sales_1 = require("../sales");
const distribution_entity_1 = require("../distributions/distribution.entity");
const distributions_1 = require("../distributions");
const production_1 = require("../production");
let MoneySourceEntity = class MoneySourceEntity {
};
exports.MoneySourceEntity = MoneySourceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MoneySourceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MoneySourceEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], MoneySourceEntity.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MoneySourceEntity.prototype, "nature", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], MoneySourceEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MoneySourceEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], MoneySourceEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdMoneySources),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], MoneySourceEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MoneySourceEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedMoneySources),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], MoneySourceEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.EmployeeCreditEntity, employeeCredit => employeeCredit.employeeId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "employeeCredits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hr_1.EmployeePaymentEntity, employeePayment => employeePayment.employeeId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "employeePayments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => money_source_transfer_entity_1.MoneySourceTransferEntity, transfer => transfer.fromMoneySourceId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "fromMoneySourceTransfers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => money_source_transfer_entity_1.MoneySourceTransferEntity, transfer => transfer.toMoneySourceId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "toMoneySourceTransfers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_entity_1.PurchaseEntity, purchase => purchase.moneySourceId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "purchases", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_1.SaleEntity, sale => sale.moneySourceId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "sales", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distribution_entity_1.DistributionEntity, distribution => distribution.moneySourceId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "cashDistributions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distributions_1.PremiseReturnEntity, r => r.moneySourceId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "returnedCashDistributions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_1.BatchEntity, b => b.moneySourceId),
    __metadata("design:type", Array)
], MoneySourceEntity.prototype, "batches", void 0);
exports.MoneySourceEntity = MoneySourceEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'money_sources' })
], MoneySourceEntity);
//# sourceMappingURL=money-source.entity.js.map