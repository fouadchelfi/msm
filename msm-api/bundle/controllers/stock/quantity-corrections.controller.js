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
exports.QuantityCorrectionsController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let QuantityCorrectionsController = class QuantityCorrectionsController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllQuantityCorrections() {
        return await queryAll().getMany();
    }
    async getOneQuantityCorrectionById(id) {
        return await queryAll()
            .where('quantitycorrection.id = :id', { id })
            .getOne();
    }
    async paginateQuantityCorrection(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.stockId))
            result = result.where("quantitycorrection.stockId = :stockId", { stockId: `${query.stockId}` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(quantitycorrection.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(quantitycorrection.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(quantitycorrection.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(quantitycorrection.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`quantitycorrection.id`, query.order)
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
    async createQuantityCorrection(body, currentUser) {
        let errors = await validateQuantityCorrection(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            stockId: body.stockId,
            oldQuantity: body.oldQuantity,
            newQuantity: body.newQuantity,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbQuantityCorrection = await (0, utils_1.repo)(entities_1.QuantityCorrectionEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbQuantityCorrection.code))
            await (0, utils_1.repo)(entities_1.QuantityCorrectionEntity).update(dbQuantityCorrection.id, { ...creation, code: (0, utils_1.code)('QTC', dbQuantityCorrection.id) });
        await this.manager.updateStockQuantity(creation.stockId, creation.newQuantity, 'replace');
        return {
            success: true,
            errors: [],
            data: await this.getOneQuantityCorrectionById(dbQuantityCorrection.id)
        };
    }
    async updateQuantityCorrection(id, body, currentUser) {
        let errors = await validateQuantityCorrection(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.QuantityCorrectionEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('QTC', id) : body.code,
            stockId: body.stockId,
            oldQuantity: body.oldQuantity,
            newQuantity: body.newQuantity,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneQuantityCorrectionById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.QuantityCorrectionEntity).delete(ids);
        return { success: true };
    }
};
exports.QuantityCorrectionsController = QuantityCorrectionsController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QuantityCorrectionsController.prototype, "getAllQuantityCorrections", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], QuantityCorrectionsController.prototype, "getOneQuantityCorrectionById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuantityCorrectionsController.prototype, "paginateQuantityCorrection", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuantityCorrectionsController.prototype, "createQuantityCorrection", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], QuantityCorrectionsController.prototype, "updateQuantityCorrection", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuantityCorrectionsController.prototype, "deleteMany", null);
exports.QuantityCorrectionsController = QuantityCorrectionsController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('quantity-corrections'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], QuantityCorrectionsController);
async function validateQuantityCorrection(quantitycorrection) {
    let errors = [];
    let quantitycorrectionDbCode = await (0, utils_1.repo)(entities_1.QuantityCorrectionEntity).createQueryBuilder('quantitycorrection').where("quantitycorrection.code = :code", { code: `${quantitycorrection.code}` }).getOne();
    if (quantitycorrectionDbCode && quantitycorrectionDbCode.id != quantitycorrection.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.QuantityCorrectionEntity)
        .createQueryBuilder('quantitycorrection')
        .leftJoinAndSelect('quantitycorrection.createdBy', 'createdBy')
        .leftJoinAndSelect('quantitycorrection.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('quantitycorrection.stockId', 'stockId')
        .select(['quantitycorrection.id', 'quantitycorrection.code', 'quantitycorrection.oldQuantity', 'quantitycorrection.newQuantity', 'quantitycorrection.date', 'quantitycorrection.notes', 'quantitycorrection.createdAt', 'quantitycorrection.lastUpdateAt', 'stockId', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=quantity-corrections.controller.js.map