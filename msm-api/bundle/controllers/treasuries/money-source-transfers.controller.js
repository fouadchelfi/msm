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
exports.MoneySourceTransfersController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let MoneySourceTransfersController = class MoneySourceTransfersController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllTransfers() {
        return await queryAll().getMany();
    }
    async getOneTransferById(id) {
        return await queryAll()
            .where('transfer.id = :id', { id })
            .getOne();
    }
    async paginateTransfer(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.fromMoneySourceId) && (0, utils_1.isNotEmpty)(query.toMoneySourceId))
            result = result
                .where("transfer.fromMoneySourceId.id = :fromMoneySourceId", { fromMoneySourceId: `${query.fromMoneySourceId}` })
                .andWhere("transfer.toMoneySourceId.id = :toMoneySourceId", { toMoneySourceId: `${query.toMoneySourceId}` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(transfer.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(transfer.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(transfer.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(transfer.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`transfer.id`, query.order)
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
    async createTransfer(body, currentUser) {
        let errors = await validateTransfer(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            fromMoneySourceId: body.fromMoneySourceId,
            toMoneySourceId: body.toMoneySourceId,
            amount: body.amount,
            oldFromMoneySourceAmount: body.oldFromMoneySourceAmount,
            newFromMoneySourceAmount: body.newFromMoneySourceAmount,
            oldToMoneySourceAmount: body.oldToMoneySourceAmount,
            newToMoneySourceAmount: body.newToMoneySourceAmount,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbTransfer = await (0, utils_1.repo)(entities_1.MoneySourceTransferEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbTransfer.code))
            await (0, utils_1.repo)(entities_1.MoneySourceTransferEntity).update(dbTransfer.id, { ...creation, code: (0, utils_1.code)('TRA', dbTransfer.id) });
        this.manager.updateMoneySourceAmount(creation.fromMoneySourceId, creation.newFromMoneySourceAmount, 'replace');
        this.manager.updateMoneySourceAmount(creation.toMoneySourceId, creation.newToMoneySourceAmount, 'replace');
        return {
            success: true,
            errors: [],
            data: await this.getOneTransferById(dbTransfer.id)
        };
    }
    async updateTransfer(id, body, currentUser) {
        let errors = await validateTransfer(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.MoneySourceTransferEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('TRA', id) : body.code,
            fromMoneySourceId: body.fromMoneySourceId,
            toMoneySourceId: body.toMoneySourceId,
            amount: body.amount,
            oldFromMoneySourceAmount: body.oldFromMoneySourceAmount,
            newFromMoneySourceAmount: body.newFromMoneySourceAmount,
            oldToMoneySourceAmount: body.oldToMoneySourceAmount,
            newToMoneySourceAmount: body.newToMoneySourceAmount,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneTransferById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.MoneySourceTransferEntity).delete(ids);
        return { success: true };
    }
};
exports.MoneySourceTransfersController = MoneySourceTransfersController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoneySourceTransfersController.prototype, "getAllTransfers", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoneySourceTransfersController.prototype, "getOneTransferById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoneySourceTransfersController.prototype, "paginateTransfer", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], MoneySourceTransfersController.prototype, "createTransfer", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], MoneySourceTransfersController.prototype, "updateTransfer", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], MoneySourceTransfersController.prototype, "deleteMany", null);
exports.MoneySourceTransfersController = MoneySourceTransfersController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('money-source-transfers'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], MoneySourceTransfersController);
async function validateTransfer(transfer) {
    let errors = [];
    let transferDbCode = await (0, utils_1.repo)(entities_1.MoneySourceTransferEntity).createQueryBuilder('transfer').where("transfer.code = :code", { code: `${transfer.code}` }).getOne();
    if (transferDbCode && transferDbCode.id != transfer.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.MoneySourceTransferEntity)
        .createQueryBuilder('transfer')
        .leftJoinAndSelect('transfer.createdBy', 'createdBy')
        .leftJoinAndSelect('transfer.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('transfer.fromMoneySourceId', 'fromMoneySourceId')
        .leftJoinAndSelect('transfer.toMoneySourceId', 'toMoneySourceId')
        .select(['transfer.id', 'transfer.code', 'transfer.amount', 'transfer.oldFromMoneySourceAmount', 'transfer.newFromMoneySourceAmount', 'transfer.oldToMoneySourceAmount', 'transfer.newToMoneySourceAmount', 'transfer.date', 'transfer.notes', 'transfer.createdAt', 'transfer.lastUpdateAt', 'fromMoneySourceId', 'toMoneySourceId', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=money-source-transfers.controller.js.map