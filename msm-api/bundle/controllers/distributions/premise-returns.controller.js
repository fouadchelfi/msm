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
exports.PremiseReturnsController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let PremiseReturnsController = class PremiseReturnsController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllPremiseReturns() {
        return await queryAll().getMany();
    }
    async getOnePremiseReturnById(id) {
        return await queryAll()
            .where('premiseReturn.id = :id', { id })
            .getOne();
    }
    async paginatePremiseReturn(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.moneySourceId))
            result = result.where("premiseReturn.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });
        if ((0, utils_1.isNotEmpty)(query.premiseId))
            result = result.andWhere("premiseReturn.premiseId = :premiseId", { premiseId: query.premiseId });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(premiseReturn.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(premiseReturn.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(premiseReturn.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(premiseReturn.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`premiseReturn.id`, query.order)
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
    async createPremiseReturn(body, currentUser) {
        let errors = await validatePremiseReturn(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            returnedCash: body.returnedCash,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            premiseId: body.premiseId,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbPremiseReturn = await (0, utils_1.repo)(entities_1.PremiseReturnEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbPremiseReturn.code))
            await (0, utils_1.repo)(entities_1.PremiseReturnEntity).update(dbPremiseReturn.id, { ...creation, code: (0, utils_1.code)('RTL', dbPremiseReturn.id) });
        body.items.map(item => item.premiseReturnId = parseInt(dbPremiseReturn.id));
        await (0, utils_1.repo)(entities_1.PremiseReturnItemEntity).save(body.items);
        for (const item of body.items) {
            await this.manager.updateStockQuantity(item.stockId, item.quantity, 'add');
        }
        this.manager.updatePremiseDebt(creation.premiseId, -(parseFloat(creation.returnedCash) + parseFloat(creation.totalAmount)), 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, creation.returnedCash, 'add');
        return {
            success: true,
            errors: [],
            data: await this.getOnePremiseReturnById(dbPremiseReturn.id)
        };
    }
    async updatePremiseReturn(id, body, currentUser) {
        let errors = await validatePremiseReturn(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.PremiseReturnEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('RTL', id) : body.code,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOnePremiseReturnById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        for (const id of ids) {
            let itemsIds = (await this.getItemsByPremiseReturnId(id)).map(item => item.id);
            if (itemsIds.length > 0)
                await (0, utils_1.repo)(entities_1.PremiseReturnItemEntity).delete(itemsIds);
            await (0, utils_1.repo)(entities_1.PremiseReturnEntity).delete(id);
        }
        return { success: true };
    }
    async getItemById(id) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }
    async getItemsByPremiseReturnId(premiseReturnId) {
        return await queryAllItems()
            .where('item.premiseReturnId = :premiseReturnId', { premiseReturnId })
            .getMany();
    }
};
exports.PremiseReturnsController = PremiseReturnsController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PremiseReturnsController.prototype, "getAllPremiseReturns", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PremiseReturnsController.prototype, "getOnePremiseReturnById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PremiseReturnsController.prototype, "paginatePremiseReturn", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PremiseReturnsController.prototype, "createPremiseReturn", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PremiseReturnsController.prototype, "updatePremiseReturn", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PremiseReturnsController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Get)('items/one/by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PremiseReturnsController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)('items/many/by-premise-return-id/:premiseReturnId'),
    __param(0, (0, common_1.Param)('premiseReturnId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PremiseReturnsController.prototype, "getItemsByPremiseReturnId", null);
exports.PremiseReturnsController = PremiseReturnsController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('premise-returns'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], PremiseReturnsController);
async function validatePremiseReturn(premiseReturn) {
    let errors = [];
    let premiseReturnDbCode = await (0, utils_1.repo)(entities_1.PremiseReturnEntity).createQueryBuilder('premiseReturn').where("premiseReturn.code = :code", { code: `${premiseReturn.code}` }).getOne();
    if (premiseReturnDbCode && premiseReturnDbCode.id != premiseReturn.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.PremiseReturnEntity)
        .createQueryBuilder('premiseReturn')
        .leftJoinAndSelect('premiseReturn.moneySourceId', 'moneySourceId')
        .leftJoinAndSelect('premiseReturn.premiseId', 'premiseId')
        .leftJoinAndSelect('premiseReturn.createdBy', 'createdBy')
        .leftJoinAndSelect('premiseReturn.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('premiseReturn.items', 'items')
        .leftJoinAndSelect('items.stockId', 'itemsStockId')
        .select([
        'premiseReturn.id',
        'premiseReturn.code',
        'premiseReturn.returnedCash',
        'premiseReturn.totalQuantity',
        'premiseReturn.totalAmount',
        'premiseReturn.date',
        'premiseReturn.notes',
        'premiseReturn.createdAt',
        'premiseReturn.lastUpdateAt',
        'moneySourceId',
        'premiseId',
        'createdBy',
        'lastUpdateBy',
        'items',
        'itemsStockId'
    ]).orderBy('items.id', 'ASC');
}
function queryAllItems() {
    return (0, utils_1.repo)(entities_1.PremiseReturnItemEntity)
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.stockId', 'stockId')
        .leftJoinAndSelect('item.premiseReturnId', 'premiseReturnId')
        .select([
        'item.id',
        'item.quantity',
        'item.salePrice',
        'item.amount',
        'stockId',
        'premiseReturnId'
    ]);
}
//# sourceMappingURL=premise-returns.controller.js.map