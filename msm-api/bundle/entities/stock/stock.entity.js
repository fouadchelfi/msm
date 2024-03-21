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
exports.StockEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const category_entity_1 = require("./category.entity");
const family_entity_1 = require("./family.entity");
const quantity_correction_entity_1 = require("./quantity-correction.entity");
const status_transfer_entity_1 = require("./status-transfer.entity");
const purchases_1 = require("../purchases");
const sales_1 = require("../sales");
const distributions_1 = require("../distributions");
const production_1 = require("../production");
let StockEntity = class StockEntity {
};
exports.StockEntity = StockEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], StockEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], StockEntity.prototype, "label", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], StockEntity.prototype, "salePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], StockEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal' }),
    __metadata("design:type", Number)
], StockEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], StockEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], StockEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.CategoryEntity, category => category.stocks),
    (0, typeorm_1.JoinColumn)({ name: "categoryId" }),
    __metadata("design:type", category_entity_1.CategoryEntity)
], StockEntity.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => family_entity_1.FamilyEntity, family => family.stocks),
    (0, typeorm_1.JoinColumn)({ name: "familyId" }),
    __metadata("design:type", family_entity_1.FamilyEntity)
], StockEntity.prototype, "familyId", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], StockEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdStocks),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], StockEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], StockEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedStocks),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], StockEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => quantity_correction_entity_1.QuantityCorrectionEntity, quantityCorrection => quantityCorrection.stockId),
    __metadata("design:type", Array)
], StockEntity.prototype, "quantityCorrections", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => status_transfer_entity_1.StatusTransferEntity, statusTransfer => statusTransfer.freeStockId),
    __metadata("design:type", Array)
], StockEntity.prototype, "freeStocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => status_transfer_entity_1.StatusTransferEntity, statusTransfer => statusTransfer.frozenStockId),
    __metadata("design:type", Array)
], StockEntity.prototype, "frozenStocks", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchases_1.PurchaseItemEntity, item => item.stockId),
    __metadata("design:type", Array)
], StockEntity.prototype, "purchaseItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sales_1.SaleItemEntity, item => item.stockId),
    __metadata("design:type", Array)
], StockEntity.prototype, "saleItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distributions_1.DistributionItemEntity, item => item.stockId),
    __metadata("design:type", Array)
], StockEntity.prototype, "distributionItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distributions_1.PremiseReturnItemEntity, item => item.stockId),
    __metadata("design:type", Array)
], StockEntity.prototype, "premiseReturnItems", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_1.BatchEntity, item => item.productId),
    __metadata("design:type", Array)
], StockEntity.prototype, "batches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => production_1.BatchItemEntity, item => item.stockId),
    __metadata("design:type", Array)
], StockEntity.prototype, "batchStockItems", void 0);
exports.StockEntity = StockEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'stocks' })
], StockEntity);
//# sourceMappingURL=stock.entity.js.map