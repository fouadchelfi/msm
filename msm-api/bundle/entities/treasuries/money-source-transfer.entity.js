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
exports.MoneySourceTransferEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const money_source_entity_1 = require("./money-source.entity");
let MoneySourceTransferEntity = class MoneySourceTransferEntity {
};
exports.MoneySourceTransferEntity = MoneySourceTransferEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], MoneySourceTransferEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MoneySourceTransferEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => money_source_entity_1.MoneySourceEntity, moneySource => moneySource.fromMoneySourceTransfers),
    (0, typeorm_1.JoinColumn)({ name: "fromMoneySourceId" }),
    __metadata("design:type", money_source_entity_1.MoneySourceEntity)
], MoneySourceTransferEntity.prototype, "fromMoneySourceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => money_source_entity_1.MoneySourceEntity, moneySource => moneySource.toMoneySourceTransfers),
    (0, typeorm_1.JoinColumn)({ name: "toMoneySourceId" }),
    __metadata("design:type", money_source_entity_1.MoneySourceEntity)
], MoneySourceTransferEntity.prototype, "toMoneySourceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], MoneySourceTransferEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], MoneySourceTransferEntity.prototype, "oldFromMoneySourceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], MoneySourceTransferEntity.prototype, "newFromMoneySourceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], MoneySourceTransferEntity.prototype, "oldToMoneySourceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], MoneySourceTransferEntity.prototype, "newToMoneySourceAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], MoneySourceTransferEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], MoneySourceTransferEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], MoneySourceTransferEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdMoneySourceTransfers),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], MoneySourceTransferEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], MoneySourceTransferEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedMoneySourceTransfers),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], MoneySourceTransferEntity.prototype, "lastUpdateBy", void 0);
exports.MoneySourceTransferEntity = MoneySourceTransferEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'money_source_transfers' })
], MoneySourceTransferEntity);
//# sourceMappingURL=money-source-transfer.entity.js.map