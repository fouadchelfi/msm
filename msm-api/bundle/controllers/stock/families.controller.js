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
exports.FamiliesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
let FamiliesController = class FamiliesController {
    async getAllFamilies() {
        return await queryAll().getMany();
    }
    async getOneCategoyById(id) {
        return await queryAll()
            .where('family.id = :id', { id })
            .getOne();
    }
    async paginateFamily(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.label))
            result = result.where("TRIM(LOWER(family.label)) LIKE :label", { label: `%${query.label.toLowerCase().trim()}%` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(family.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(family.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(family.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(family.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`family.id`, query.order)
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
    async createFamily(body, currentUser) {
        let errors = await validateFamily(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            label: body.label,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbFamily = await (0, utils_1.repo)(entities_1.FamilyEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbFamily.code))
            await (0, utils_1.repo)(entities_1.FamilyEntity).update(dbFamily.id, { ...creation, code: (0, utils_1.code)('FML', dbFamily.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbFamily.id)
        };
    }
    async updateFamily(id, body, currentUser) {
        let errors = await validateFamily(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.FamilyEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('FML', id) : body.code,
            label: body.label,
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
        await (0, utils_1.repo)(entities_1.FamilyEntity).delete(ids);
        return { success: true };
    }
};
exports.FamiliesController = FamiliesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FamiliesController.prototype, "getAllFamilies", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FamiliesController.prototype, "getOneCategoyById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamiliesController.prototype, "paginateFamily", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FamiliesController.prototype, "createFamily", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], FamiliesController.prototype, "updateFamily", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FamiliesController.prototype, "deleteMany", null);
exports.FamiliesController = FamiliesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('families')
], FamiliesController);
async function validateFamily(family) {
    let errors = [];
    let familyDbCode = await (0, utils_1.repo)(entities_1.FamilyEntity).createQueryBuilder('family').where("family.code = :code", { code: `${family.code}` }).getOne();
    if (familyDbCode && familyDbCode.id != family.id)
        errors.push("Code existe déjà");
    let familyDbLabel = await (0, utils_1.repo)(entities_1.FamilyEntity).createQueryBuilder('family').where("TRIM(LOWER(family.label)) = :label", { label: `${family.label.toLowerCase().trim()}` }).getOne();
    if (familyDbLabel && familyDbLabel.id != family.id)
        errors.push("Libellé existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.FamilyEntity)
        .createQueryBuilder('family')
        .leftJoinAndSelect('family.createdBy', 'createdBy')
        .leftJoinAndSelect('family.lastUpdateBy', 'lastUpdateBy')
        .select(['family.id', 'family.code', 'family.label', 'family.notes', 'family.createdAt', 'family.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=families.controller.js.map