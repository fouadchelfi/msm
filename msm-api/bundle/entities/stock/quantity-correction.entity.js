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
exports.QuantityCorrectionEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const stock_entity_1 = require("./stock.entity");
let QuantityCorrectionEntity = class QuantityCorrectionEntity {
};
exports.QuantityCorrectionEntity = QuantityCorrectionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], QuantityCorrectionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuantityCorrectionEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_entity_1.StockEntity, stock => stock.quantityCorrections),
    (0, typeorm_1.JoinColumn)({ name: "stockId" }),
    __metadata("design:type", stock_entity_1.StockEntity)
], QuantityCorrectionEntity.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], QuantityCorrectionEntity.prototype, "oldQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'real' }),
    __metadata("design:type", Number)
], QuantityCorrectionEntity.prototype, "newQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], QuantityCorrectionEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], QuantityCorrectionEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], QuantityCorrectionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdQuantityCorrections),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], QuantityCorrectionEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], QuantityCorrectionEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedQuantityCorrections),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], QuantityCorrectionEntity.prototype, "lastUpdateBy", void 0);
exports.QuantityCorrectionEntity = QuantityCorrectionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'quantity_corrections' })
], QuantityCorrectionEntity);
//# sourceMappingURL=quantity-correction.entity.js.map