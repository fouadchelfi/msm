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
exports.LossesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
let LossesController = class LossesController {
    async getAllLosses() {
        return await queryAll().getMany();
    }
    async getOneCategoyById(id) {
        return await queryAll()
            .where('losse.id = :id', { id })
            .getOne();
    }
    async paginateLosse(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.label))
            result = result.where("TRIM(LOWER(losse.label)) LIKE :label", { label: `%${query.label.toLowerCase().trim()}%` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(losse.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(losse.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(losse.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(losse.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`losse.id`, query.order)
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
    async createLosse(body, currentUser) {
        let errors = await validateLosse(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            label: body.label,
            losseNatureId: body.losseNatureId,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbLosse = await (0, utils_1.repo)(entities_1.LosseEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbLosse.code))
            await (0, utils_1.repo)(entities_1.LosseEntity).update(dbLosse.id, { ...creation, code: (0, utils_1.code)('CHR', dbLosse.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbLosse.id)
        };
    }
    async updateLosse(id, body, currentUser) {
        let errors = await validateLosse(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.LosseEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('CHR', id) : body.code,
            label: body.label,
            losseNatureId: body.losseNatureId,
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
        await (0, utils_1.repo)(entities_1.LosseEntity).delete(ids);
        return { success: true };
    }
};
exports.LossesController = LossesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LossesController.prototype, "getAllLosses", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LossesController.prototype, "getOneCategoyById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LossesController.prototype, "paginateLosse", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LossesController.prototype, "createLosse", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], LossesController.prototype, "updateLosse", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LossesController.prototype, "deleteMany", null);
exports.LossesController = LossesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('losses')
], LossesController);
async function validateLosse(losse) {
    let errors = [];
    let losseDbCode = await (0, utils_1.repo)(entities_1.LosseEntity).createQueryBuilder('losse').where("losse.code = :code", { code: `${losse.code}` }).getOne();
    if (losseDbCode && losseDbCode.id != losse.id)
        errors.push("Code existe déjà");
    let losseDbLabel = await (0, utils_1.repo)(entities_1.LosseEntity).createQueryBuilder('losse').where("TRIM(LOWER(losse.label)) = :label", { label: `${losse.label.toLowerCase().trim()}` }).getOne();
    if (losseDbLabel && losseDbLabel.id != losse.id)
        errors.push("Libellé existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.LosseEntity)
        .createQueryBuilder('losse')
        .leftJoinAndSelect('losse.createdBy', 'createdBy')
        .leftJoinAndSelect('losse.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('losse.losseNatureId', 'losseNatureId')
        .select(['losse.id', 'losse.code', 'losse.label', 'losse.notes', 'losseNatureId', 'losse.amount', 'losse.date', 'losse.createdAt', 'losse.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=losses.controller.js.map