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
exports.PurchaseItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_1 = require("../stock");
const purchase_entity_1 = require("./purchase.entity");
let PurchaseItemEntity = class PurchaseItemEntity {
};
exports.PurchaseItemEntity = PurchaseItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PurchaseItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_1.StockEntity, stock => stock.purchaseItems),
    (0, typeorm_1.JoinColumn)({ name: "stockId" }),
    __metadata("design:type", stock_1.StockEntity)
], PurchaseItemEntity.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], PurchaseItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], PurchaseItemEntity.prototype, "salePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], PurchaseItemEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_entity_1.PurchaseEntity, p => p.items),
    (0, typeorm_1.JoinColumn)({ name: "purchaseId" }),
    __metadata("design:type", purchase_entity_1.PurchaseEntity)
], PurchaseItemEntity.prototype, "purchaseId", void 0);
exports.PurchaseItemEntity = PurchaseItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'purchase_items' })
], PurchaseItemEntity);
//# sourceMappingURL=purchase-item.entity.js.map