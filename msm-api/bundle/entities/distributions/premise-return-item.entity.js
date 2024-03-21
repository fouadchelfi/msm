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
exports.PremiseReturnItemEntity = void 0;
const typeorm_1 = require("typeorm");
const stock_1 = require("../stock");
const premise_return_entity_1 = require("./premise-return.entity");
let PremiseReturnItemEntity = class PremiseReturnItemEntity {
};
exports.PremiseReturnItemEntity = PremiseReturnItemEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PremiseReturnItemEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => stock_1.StockEntity, stock => stock.premiseReturnItems),
    (0, typeorm_1.JoinColumn)({ name: "stockId" }),
    __metadata("design:type", stock_1.StockEntity)
], PremiseReturnItemEntity.prototype, "stockId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], PremiseReturnItemEntity.prototype, "quantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], PremiseReturnItemEntity.prototype, "salePrice", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], PremiseReturnItemEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => premise_return_entity_1.PremiseReturnEntity, p => p.items),
    (0, typeorm_1.JoinColumn)({ name: "premiseReturnId" }),
    __metadata("design:type", premise_return_entity_1.PremiseReturnEntity)
], PremiseReturnItemEntity.prototype, "premiseReturnId", void 0);
exports.PremiseReturnItemEntity = PremiseReturnItemEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'premise_return_items' })
], PremiseReturnItemEntity);
//# sourceMappingURL=premise-return-item.entity.js.map