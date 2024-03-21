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
exports.CustomerEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const sale_entity_1 = require("./sale.entity");
let CustomerEntity = class CustomerEntity {
};
exports.CustomerEntity = CustomerEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], CustomerEntity.prototype, "debt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "phoneNumberOne", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "phoneNumberTow", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "fax", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdCustomers),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], CustomerEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], CustomerEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedCustomers),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], CustomerEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => sale_entity_1.SaleEntity, sale => sale.customerId),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "sales", void 0);
exports.CustomerEntity = CustomerEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'customers' })
], CustomerEntity);
//# sourceMappingURL=customer.entity.js.map