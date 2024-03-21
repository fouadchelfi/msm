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
exports.BatchEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const treasuries_1 = require("../treasuries");
const batch_item_entity_1 = require("./batch-item.entity");
const batch_ingredient_entity_1 = require("./batch-ingredient.entity");
const stock_1 = require("../stock");
let BatchEntity = class BatchEntity {
};
exports.BatchEntity = BatchEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], BatchEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BatchEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], BatchEntity.prototype, "totalQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], BatchEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], BatchEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_1.StockEntity, entity => entity.batches),
    (0, typeorm_1.JoinColumn)({ name: "productId" }),
    __metadata("design:type", stock_1.StockEntity)
], BatchEntity.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => treasuries_1.MoneySourceEntity, moneySource => moneySource.batches),
    (0, typeorm_1.JoinColumn)({ name: "moneySourceId" }),
    __metadata("design:type", treasuries_1.MoneySourceEntity)
], BatchEntity.prototype, "moneySourceId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], BatchEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BatchEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], BatchEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdBatches),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], BatchEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], BatchEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedBatches),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], BatchEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => batch_item_entity_1.BatchItemEntity, item => item.batchId),
    __metadata("design:type", Array)
], BatchEntity.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => batch_ingredient_entity_1.BatchIngredientEntity, item => item.batchId),
    __metadata("design:type", Array)
], BatchEntity.prototype, "ingredients", void 0);
exports.BatchEntity = BatchEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'batches' })
], BatchEntity);
//# sourceMappingURL=batch.entity.js.map