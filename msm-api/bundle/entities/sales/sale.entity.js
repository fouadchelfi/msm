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
exports.SaleEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const treasuries_1 = require("../treasuries");
const customer_entity_1 = require("./customer.entity");
const sale_item_entity_1 = require("./sale-item.entity");
let SaleEntity = class SaleEntity {
};
exports.SaleEntity = SaleEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], SaleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], SaleEntity.prototype, "totalQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], SaleEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], SaleEntity.prototype, "payment", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], SaleEntity.prototype, "deliveryAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => treasuries_1.MoneySourceEntity, moneySource => moneySource.sales),
    (0, typeorm_1.JoinColumn)({ name: "moneySourceId" }),
    __metadata("design:type", treasuries_1.MoneySourceEntity)
], SaleEntity.prototype, "moneySourceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.CustomerEntity, customer => customer.sales),
    (0, typeorm_1.JoinColumn)({ name: "customerId" }),
    __metadata("design:type", customer_entity_1.CustomerEntity)
], SaleEntity.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], SaleEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], SaleEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], SaleEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdSales),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], SaleEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], SaleEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedSales),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], SaleEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_item_entity_1.SaleItemEntity, item => item.saleId),
    __metadata("design:type", Array)
], SaleEntity.prototype, "items", void 0);
exports.SaleEntity = SaleEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'sales' })
], SaleEntity);
//# sourceMappingURL=sale.entity.js.map