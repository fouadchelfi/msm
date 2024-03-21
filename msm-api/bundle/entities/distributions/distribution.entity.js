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
exports.DistributionEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const treasuries_1 = require("../treasuries");
const premise_entity_1 = require("./premise.entity");
const distribution_item_entity_1 = require("./distribution-item.entity");
let DistributionEntity = class DistributionEntity {
};
exports.DistributionEntity = DistributionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], DistributionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DistributionEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'real' }),
    __metadata("design:type", Number)
], DistributionEntity.prototype, "totalQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], DistributionEntity.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], DistributionEntity.prototype, "cash", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => treasuries_1.MoneySourceEntity, moneySource => moneySource.cashDistributions),
    (0, typeorm_1.JoinColumn)({ name: "moneySourceId" }),
    __metadata("design:type", treasuries_1.MoneySourceEntity)
], DistributionEntity.prototype, "moneySourceId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => premise_entity_1.PremiseEntity, premise => premise.distributions),
    (0, typeorm_1.JoinColumn)({ name: "premiseId" }),
    __metadata("design:type", premise_entity_1.PremiseEntity)
], DistributionEntity.prototype, "premiseId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Date)
], DistributionEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], DistributionEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], DistributionEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdDistributions),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], DistributionEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], DistributionEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedDistributions),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], DistributionEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => distribution_item_entity_1.DistributionItemEntity, item => item.distributionId),
    __metadata("design:type", Array)
], DistributionEntity.prototype, "items", void 0);
exports.DistributionEntity = DistributionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'distributions' })
], DistributionEntity);
//# sourceMappingURL=distribution.entity.js.map