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
exports.DistributionItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_1 = require("../stock");
const distribution_entity_1 = require("./distribution.entity");
let DistributionItemEntity = class DistributionItemEntity {
};
exports.DistributionItemEntity = DistributionItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DistributionItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_1.StockEntity, stock => stock.distributionItems),
    (0, typeorm_1.JoinColumn)({ name: "stockId" }),
    __metadata("design:type", stock_1.StockEntity)
], DistributionItemEntity.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], DistributionItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], DistributionItemEntity.prototype, "salePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], DistributionItemEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => distribution_entity_1.DistributionEntity, p => p.items),
    (0, typeorm_1.JoinColumn)({ name: "distributionId" }),
    __metadata("design:type", distribution_entity_1.DistributionEntity)
], DistributionItemEntity.prototype, "distributionId", void 0);
exports.DistributionItemEntity = DistributionItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'distribution_items' })
], DistributionItemEntity);
//# sourceMappingURL=distribution-item.entity.js.map