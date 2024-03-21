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
exports.SaleItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_1 = require("../stock");
const sale_entity_1 = require("./sale.entity");
let SaleItemEntity = class SaleItemEntity {
};
exports.SaleItemEntity = SaleItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SaleItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_1.StockEntity, stock => stock.saleItems),
    (0, typeorm_1.JoinColumn)({ name: "stockId" }),
    __metadata("design:type", stock_1.StockEntity)
], SaleItemEntity.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], SaleItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], SaleItemEntity.prototype, "salePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], SaleItemEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => sale_entity_1.SaleEntity, p => p.items),
    (0, typeorm_1.JoinColumn)({ name: "saleId" }),
    __metadata("design:type", sale_entity_1.SaleEntity)
], SaleItemEntity.prototype, "saleId", void 0);
exports.SaleItemEntity = SaleItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'sale_items' })
], SaleItemEntity);
//# sourceMappingURL=sale-item.entity.js.map