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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeePaymentsController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let EmployeePaymentsController = class EmployeePaymentsController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllPayments() {
        return await queryAll().getMany();
    }
    async getOnePaymentById(id) {
        return await queryAll()
            .where('payment.id = :id', { id })
            .getOne();
    }
    async paginatePayment(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.employeeId))
            result = result.where("payment.employeeId = :employeeId", { employeeId: query.employeeId });
        if ((0, utils_1.isNotEmpty)(query.moneySourceId))
            result = result.andWhere("payment.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(payment.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(payment.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(payment.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(payment.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`payment.id`, query.order)
            .skip(parseInt(query.pageIndex) * parseInt(query.pageSize))
            .take(parseInt(query.pageSize));
        let [items, count] = await result.getManyAndCount();
        return {
            order: query.order,
            sort: query.sort,
            pageIndex: parseInt(query.pageIndex),
            pageSize: parseInt(query.pageSize),
            items: items,
            count: count,
        };
    }
    async createPayment(body, currentUser) {
        let errors = await validatePayment(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            employeeId: body.employeeId,
            moneySourceId: body.moneySourceId,
            moneySourceAmount: body.moneySourceAmount,
            payment: body.payment,
            calculatedPayment: body.calculatedPayment,
            restPayment: body.restPayment,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbPayment = await (0, utils_1.repo)(entities_1.EmployeePaymentEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbPayment.code))
            await (0, utils_1.repo)(entities_1.EmployeePaymentEntity).update(dbPayment.id, { ...creation, code: (0, utils_1.code)('PME', dbPayment.id) });
        this.manager.updateEmployeeDebt(creation.employeeId, creation.restPayment, 'replace');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.payment, 'add');
        return {
            success: true,
            errors: [],
            data: await this.getOnePaymentById(dbPayment.id)
        };
    }
    async updatePayment(id, body, currentUser) {
        let errors = await validatePayment(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.EmployeePaymentEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('PME', id) : body.code,
            employeeId: body.employeeId,
            moneySourceId: body.moneySourceId,
            moneySourceAmount: body.moneySourceAmount,
            payment: body.payment,
            calculatedPayment: body.calculatedPayment,
            restPayment: body.restPayment,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOnePaymentById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.EmployeePaymentEntity).delete(ids);
        return { success: true };
    }
};
exports.EmployeePaymentsController = EmployeePaymentsController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "getAllPayments", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "getOnePaymentById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "paginatePayment", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "updatePayment", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeePaymentsController.prototype, "deleteMany", null);
exports.EmployeePaymentsController = EmployeePaymentsController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('employee-payments'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], EmployeePaymentsController);
async function validatePayment(payment) {
    let errors = [];
    let paymentDbCode = await (0, utils_1.repo)(entities_1.EmployeePaymentEntity).createQueryBuilder('payment').where("payment.code = :code", { code: `${payment.code}` }).getOne();
    if (paymentDbCode && paymentDbCode.id != payment.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.EmployeePaymentEntity)
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.createdBy', 'createdBy')
        .leftJoinAndSelect('payment.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('payment.employeeId', 'employeeId')
        .leftJoinAndSelect('payment.moneySourceId', 'moneySourceId')
        .select(['payment.id', 'payment.code', 'employeeId', 'moneySourceId', 'payment.payment', 'payment.moneySourceAmount', 'payment.calculatedPayment', 'payment.restPayment', 'payment.date', 'payment.notes', 'payment.createdAt', 'payment.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=employee-payments.controller.js.map