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
exports.StatusTransfersController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let StatusTransfersController = class StatusTransfersController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllStatusTransfers() {
        return await queryAll().getMany();
    }
    async getOneStatusTransferById(id) {
        return await queryAll()
            .where('statustransfer.id = :id', { id })
            .getOne();
    }
    async paginateStatusTransfer(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.freeStockId))
            result = result.where("statustransfer.freeStockId.id = :freeStockId", { freeStockId: `${query.freeStockId}` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(statustransfer.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(statustransfer.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(statustransfer.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(statustransfer.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`statustransfer.id`, query.order)
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
    async createStatusTransfer(body, currentUser) {
        let errors = await validateStatusTransfer(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            freeStockId: body.freeStockId,
            frozenStockId: body.frozenStockId,
            transferedQuantity: body.transferedQuantity,
            oldFreeQuantity: body.oldFreeQuantity,
            newFreeQuantity: body.newFreeQuantity,
            oldFrozenQuantity: body.oldFrozenQuantity,
            newFrozenQuantity: body.newFrozenQuantity,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbStatusTransfer = await (0, utils_1.repo)(entities_1.StatusTransferEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbStatusTransfer.code))
            await (0, utils_1.repo)(entities_1.StatusTransferEntity).update(dbStatusTransfer.id, { ...creation, code: (0, utils_1.code)('STT', dbStatusTransfer.id) });
        await this.manager.updateStockQuantity(creation.freeStockId, creation.newFreeQuantity, 'replace');
        await this.manager.updateStockQuantity(creation.frozenStockId, creation.newFrozenQuantity, 'replace');
        return {
            success: true,
            errors: [],
            data: await this.getOneStatusTransferById(dbStatusTransfer.id)
        };
    }
    async updateStatusTransfer(id, body, currentUser) {
        let errors = await validateStatusTransfer(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.StatusTransferEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('STT', id) : body.code,
            freeStockId: body.freeStockId,
            frozenStockId: body.frozenStockId,
            transferedQuantity: body.transferedQuantity,
            oldFreeQuantity: body.oldFreeQuantity,
            newFreeQuantity: body.newFreeQuantity,
            oldFrozenQuantity: body.oldFrozenQuantity,
            newFrozenQuantity: body.newFrozenQuantity,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneStatusTransferById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.StatusTransferEntity).delete(ids);
        return { success: true };
    }
};
exports.StatusTransfersController = StatusTransfersController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StatusTransfersController.prototype, "getAllStatusTransfers", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StatusTransfersController.prototype, "getOneStatusTransferById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatusTransfersController.prototype, "paginateStatusTransfer", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StatusTransfersController.prototype, "createStatusTransfer", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], StatusTransfersController.prototype, "updateStatusTransfer", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StatusTransfersController.prototype, "deleteMany", null);
exports.StatusTransfersController = StatusTransfersController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('status-transfers'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], StatusTransfersController);
async function validateStatusTransfer(statustransfer) {
    let errors = [];
    let statustransferDbCode = await (0, utils_1.repo)(entities_1.StatusTransferEntity).createQueryBuilder('statustransfer').where("statustransfer.code = :code", { code: `${statustransfer.code}` }).getOne();
    if (statustransferDbCode && statustransferDbCode.id != statustransfer.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.StatusTransferEntity)
        .createQueryBuilder('statustransfer')
        .leftJoinAndSelect('statustransfer.createdBy', 'createdBy')
        .leftJoinAndSelect('statustransfer.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('statustransfer.freeStockId', 'freeStockId')
        .leftJoinAndSelect('statustransfer.frozenStockId', 'frozenStockId')
        .select(['statustransfer.id', 'statustransfer.code', 'statustransfer.transferedQuantity', 'statustransfer.oldFreeQuantity', 'statustransfer.newFreeQuantity', 'statustransfer.oldFrozenQuantity', 'statustransfer.newFrozenQuantity', 'statustransfer.date', 'statustransfer.notes', 'statustransfer.createdAt', 'statustransfer.lastUpdateAt', 'freeStockId', 'frozenStockId', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=status-transfers.controller.js.map