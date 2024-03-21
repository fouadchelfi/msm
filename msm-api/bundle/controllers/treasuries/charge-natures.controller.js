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
exports.ChargeNaturesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
let ChargeNaturesController = class ChargeNaturesController {
    async getAllChargeNatures() {
        return await queryAll().getMany();
    }
    async getOneCategoyById(id) {
        return await queryAll()
            .where('chargeNature.id = :id', { id })
            .getOne();
    }
    async paginateChargeNature(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.label))
            result = result.where("TRIM(LOWER(chargeNature.label)) LIKE :label", { label: `%${query.label.toLowerCase().trim()}%` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(chargeNature.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(chargeNature.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(chargeNature.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(chargeNature.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`chargeNature.id`, query.order)
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
    async createChargeNature(body, currentUser) {
        let errors = await validateChargeNature(body);
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
        let dbChargeNature = await (0, utils_1.repo)(entities_1.ChargeNatureEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbChargeNature.code))
            await (0, utils_1.repo)(entities_1.ChargeNatureEntity).update(dbChargeNature.id, { ...creation, code: (0, utils_1.code)('NCH', dbChargeNature.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbChargeNature.id)
        };
    }
    async updateChargeNature(id, body, currentUser) {
        let errors = await validateChargeNature(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.ChargeNatureEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('NCH', id) : body.code,
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
        await (0, utils_1.repo)(entities_1.ChargeNatureEntity).delete(ids);
        return { success: true };
    }
};
exports.ChargeNaturesController = ChargeNaturesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ChargeNaturesController.prototype, "getAllChargeNatures", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], ChargeNaturesController.prototype, "getOneCategoyById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChargeNaturesController.prototype, "paginateChargeNature", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChargeNaturesController.prototype, "createChargeNature", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], ChargeNaturesController.prototype, "updateChargeNature", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChargeNaturesController.prototype, "deleteMany", null);
exports.ChargeNaturesController = ChargeNaturesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('charge-natures')
], ChargeNaturesController);
async function validateChargeNature(chargeNature) {
    let errors = [];
    let chargenatureDbCode = await (0, utils_1.repo)(entities_1.ChargeNatureEntity).createQueryBuilder('chargeNature').where("chargeNature.code = :code", { code: `${chargeNature.code}` }).getOne();
    if (chargenatureDbCode && chargenatureDbCode.id != chargeNature.id)
        errors.push("Code existe déjà");
    let chargenatureDbLabel = await (0, utils_1.repo)(entities_1.ChargeNatureEntity).createQueryBuilder('chargeNature').where("TRIM(LOWER(chargeNature.label)) = :label", { label: `${chargeNature.label.toLowerCase().trim()}` }).getOne();
    if (chargenatureDbLabel && chargenatureDbLabel.id != chargeNature.id)
        errors.push("Libellé existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.ChargeNatureEntity)
        .createQueryBuilder('chargeNature')
        .leftJoinAndSelect('chargeNature.createdBy', 'createdBy')
        .leftJoinAndSelect('chargeNature.lastUpdateBy', 'lastUpdateBy')
        .select(['chargeNature.id', 'chargeNature.code', 'chargeNature.label', 'chargeNature.notes', 'chargeNature.createdAt', 'chargeNature.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=charge-natures.controller.js.map