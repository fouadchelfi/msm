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
exports.EmployeeCreditsController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let EmployeeCreditsController = class EmployeeCreditsController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllCredits() {
        return await queryAll().getMany();
    }
    async getOneCreditById(id) {
        return await queryAll()
            .where('credit.id = :id', { id })
            .getOne();
    }
    async paginateCredit(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.employeeId))
            result = result.where("credit.employeeId = :employeeId", { employeeId: query.employeeId });
        if ((0, utils_1.isNotEmpty)(query.moneySourceId))
            result = result.andWhere("credit.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(credit.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(credit.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(credit.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(credit.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`credit.id`, query.order)
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
    async createCredit(body, currentUser) {
        let errors = await validateCredit(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            employeeId: body.employeeId,
            moneySourceId: body.moneySourceId,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbCredit = await (0, utils_1.repo)(entities_1.EmployeeCreditEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbCredit.code))
            await (0, utils_1.repo)(entities_1.EmployeeCreditEntity).update(dbCredit.id, { ...creation, code: (0, utils_1.code)('ACC', dbCredit.id) });
        this.manager.updateEmployeeDebt(creation.employeeId, creation.amount, 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.amount, 'add');
        return {
            success: true,
            errors: [],
            data: await this.getOneCreditById(dbCredit.id)
        };
    }
    async updateCredit(id, body, currentUser) {
        let errors = await validateCredit(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.EmployeeCreditEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('ACC', id) : body.code,
            employeeId: body.employeeId,
            moneySourceId: body.moneySourceId,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneCreditById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.EmployeeCreditEntity).delete(ids);
        return { success: true };
    }
};
exports.EmployeeCreditsController = EmployeeCreditsController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EmployeeCreditsController.prototype, "getAllCredits", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], EmployeeCreditsController.prototype, "getOneCreditById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeCreditsController.prototype, "paginateCredit", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeCreditsController.prototype, "createCredit", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], EmployeeCreditsController.prototype, "updateCredit", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EmployeeCreditsController.prototype, "deleteMany", null);
exports.EmployeeCreditsController = EmployeeCreditsController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('employee-credits'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], EmployeeCreditsController);
async function validateCredit(credit) {
    let errors = [];
    let creditDbCode = await (0, utils_1.repo)(entities_1.EmployeeCreditEntity).createQueryBuilder('credit').where("credit.code = :code", { code: `${credit.code}` }).getOne();
    if (creditDbCode && creditDbCode.id != credit.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.EmployeeCreditEntity)
        .createQueryBuilder('credit')
        .leftJoinAndSelect('credit.createdBy', 'createdBy')
        .leftJoinAndSelect('credit.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('credit.employeeId', 'employeeId')
        .leftJoinAndSelect('credit.moneySourceId', 'moneySourceId')
        .select(['credit.id', 'credit.code', 'employeeId', 'moneySourceId', 'credit.amount', 'credit.date', 'credit.notes', 'credit.createdAt', 'credit.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=employee-credits.controller.js.map