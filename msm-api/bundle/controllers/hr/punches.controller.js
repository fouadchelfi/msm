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
exports.PunchesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let PunchesController = class PunchesController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllPunches() {
        return await queryAll().getMany();
    }
    async getOneCategoyById(id) {
        return await queryAll()
            .where('punche.id = :id', { id })
            .getOne();
    }
    async paginatePunche(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.employeeId))
            result = result.where("punche.employeeId = :employeeId", { employeeId: query.employeeId });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(punche.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(punche.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(punche.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(punche.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`punche.id`, query.order)
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
    async createPunche(body, currentUser) {
        let errors = await validatePunche(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            employeeId: body.employeeId,
            hourlyCoefficient: body.hourlyCoefficient,
            salary: body.salary,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbPunche = await (0, utils_1.repo)(entities_1.PuncheEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbPunche.code))
            await (0, utils_1.repo)(entities_1.PuncheEntity).update(dbPunche.id, { ...creation, code: (0, utils_1.code)('PTG', dbPunche.id) });
        let employee = await (0, utils_1.repo)(entities_1.EmployeeEntity)
            .createQueryBuilder('employee')
            .where('employee.id = :id', { id: creation.employeeId })
            .getOne();
        this.manager.updateEmployeeDebt(creation.employeeId, (parseFloat(employee.salary) / 26) * parseFloat(creation.hourlyCoefficient), 'add');
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbPunche.id)
        };
    }
    async updatePunche(id, body, currentUser) {
        let errors = await validatePunche(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.PuncheEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('PTG', id) : body.code,
            employeeId: body.employeeId,
            hourlyCoefficient: body.hourlyCoefficient,
            salary: body.salary,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.PuncheEntity).delete(ids);
        return { success: true };
    }
};
exports.PunchesController = PunchesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PunchesController.prototype, "getAllPunches", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PunchesController.prototype, "getOneCategoyById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PunchesController.prototype, "paginatePunche", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PunchesController.prototype, "createPunche", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PunchesController.prototype, "updatePunche", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PunchesController.prototype, "deleteMany", null);
exports.PunchesController = PunchesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('punches'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], PunchesController);
async function validatePunche(punche) {
    let errors = [];
    let puncheDbCode = await (0, utils_1.repo)(entities_1.PuncheEntity).createQueryBuilder('punche').where("punche.code = :code", { code: `${punche.code}` }).getOne();
    if (puncheDbCode && puncheDbCode.id != punche.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.PuncheEntity)
        .createQueryBuilder('punche')
        .leftJoinAndSelect('punche.createdBy', 'createdBy')
        .leftJoinAndSelect('punche.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('punche.employeeId', 'employeeId')
        .select(['punche.id', 'punche.code', 'employeeId', 'punche.hourlyCoefficient', 'punche.salary', 'punche.amount', 'punche.date', 'punche.notes', 'punche.createdAt', 'punche.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=punches.controller.js.map