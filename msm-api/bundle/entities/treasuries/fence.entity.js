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
exports.FenceEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const stock_1 = require("../stock");
let FenceEntity = class FenceEntity {
};
exports.FenceEntity = FenceEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], FenceEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FenceEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_1.CategoryEntity, category => category.fences),
    (0, typeorm_1.JoinColumn)({ name: "categoryId" }),
    __metadata("design:type", stock_1.CategoryEntity)
], FenceEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], FenceEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "inStockQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "inStockAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "calculatedInStockQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "calculatedInStockAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalCustomersSaleAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalPremisesSaleAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalPurchaseAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalCharges", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalLosses", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalEmployeesPayments", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalEmployeesDebts", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalSuppliersDebts", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalCustomersDebts", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalBatchesStocksAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "totalBatchesIngredientsAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "marginProfit", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], FenceEntity.prototype, "rawProfit", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], FenceEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], FenceEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdFences),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], FenceEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], FenceEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedFences),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], FenceEntity.prototype, "lastUpdateBy", void 0);
exports.FenceEntity = FenceEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'fences' })
], FenceEntity);
//# sourceMappingURL=fence.entity.js.map