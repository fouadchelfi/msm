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
exports.EmployeeCreditEntity = void 0;
const typeorm_1 = require("typeorm");
const settings_1 = require("../settings");
const employee_entity_1 = require("./employee.entity");
const treasuries_1 = require("../treasuries");
let EmployeeCreditEntity = class EmployeeCreditEntity {
};
exports.EmployeeCreditEntity = EmployeeCreditEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], EmployeeCreditEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeCreditEntity.prototype, "code", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => employee_entity_1.EmployeeEntity, employee => employee.employeeCredits),
    (0, typeorm_1.JoinColumn)({ name: "employeeId" }),
    __metadata("design:type", employee_entity_1.EmployeeEntity)
], EmployeeCreditEntity.prototype, "employeeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => treasuries_1.MoneySourceEntity, moneySource => moneySource.employeeCredits),
    (0, typeorm_1.JoinColumn)({ name: "moneySourceId" }),
    __metadata("design:type", treasuries_1.MoneySourceEntity)
], EmployeeCreditEntity.prototype, "moneySourceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0, type: 'decimal' }),
    __metadata("design:type", Number)
], EmployeeCreditEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], EmployeeCreditEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], EmployeeCreditEntity.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ update: false }),
    __metadata("design:type", Date)
], EmployeeCreditEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.createdEmployeeCredits),
    (0, typeorm_1.JoinColumn)({ name: "createdBy" }),
    __metadata("design:type", settings_1.UserEntity)
], EmployeeCreditEntity.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], EmployeeCreditEntity.prototype, "lastUpdateAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => settings_1.UserEntity, user => user.updatedEmployeeCredits),
    (0, typeorm_1.JoinColumn)({ name: "lastUpdateBy" }),
    __metadata("design:type", settings_1.UserEntity)
], EmployeeCreditEntity.prototype, "lastUpdateBy", void 0);
exports.EmployeeCreditEntity = EmployeeCreditEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'employee_credits' })
], EmployeeCreditEntity);
//# sourceMappingURL=employee-credit.entity.js.map