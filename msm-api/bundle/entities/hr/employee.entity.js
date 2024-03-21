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
exports.EmployeeEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const punche_entity_1 = require("./punche.entity");
const employee_credit_entity_1 = require("./employee-credit.entity");
const employee_payment_entity_1 = require("./employee-payment.entity");
let EmployeeEntity = class EmployeeEntity {
};
exports.EmployeeEntity = EmployeeEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "salary", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], EmployeeEntity.prototype, "debt", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "province", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "phoneNumberOne", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "phoneNumberTow", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "fax", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdEmployees),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], EmployeeEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], EmployeeEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedEmployees),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], EmployeeEntity.prototype, "lastUpdateBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => punche_entity_1.PuncheEntity, punche => punche.employeeId),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "punches", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_credit_entity_1.EmployeeCreditEntity, employeeCredit => employeeCredit.employeeId),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "employeeCredits", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => employee_payment_entity_1.EmployeePaymentEntity, employeePayment => employeePayment.employeeId),
    __metadata("design:type", Array)
], EmployeeEntity.prototype, "employeePayments", void 0);
exports.EmployeeEntity = EmployeeEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'employees' })
], EmployeeEntity);
//# sourceMappingURL=employee.entity.js.map