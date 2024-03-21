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
exports.DistributionsController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let DistributionsController = class DistributionsController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllDistributions() {
        return await queryAll().getMany();
    }
    async getOneDistributionById(id) {
        return await queryAll()
            .where('distribution.id = :id', { id })
            .getOne();
    }
    async paginateDistribution(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.moneySourceId))
            result = result.where("distribution.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });
        if ((0, utils_1.isNotEmpty)(query.premiseId))
            result = result.andWhere("distribution.premiseId = :premiseId", { premiseId: query.premiseId });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(distribution.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(distribution.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(distribution.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(distribution.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`distribution.id`, query.order)
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
    async createDistribution(body, currentUser) {
        let errors = await validateDistribution(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            cash: body.cash,
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
        let dbDistribution = await (0, utils_1.repo)(entities_1.DistributionEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbDistribution.code))
            await (0, utils_1.repo)(entities_1.DistributionEntity).update(dbDistribution.id, { ...creation, code: (0, utils_1.code)('DST', dbDistribution.id) });
        body.items.map(item => item.distributionId = parseInt(dbDistribution.id));
        await (0, utils_1.repo)(entities_1.DistributionItemEntity).save(body.items);
        for (const item of body.items) {
            await this.manager.updateStockQuantity(item.stockId, -item.quantity, 'add');
        }
        this.manager.updatePremiseDebt(creation.premiseId, parseFloat(creation.cash) + parseFloat(creation.totalAmount), 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.cash, 'add');
        return {
            success: true,
            errors: [],
            data: await this.getOneDistributionById(dbDistribution.id)
        };
    }
    async updateDistribution(id, body, currentUser) {
        let errors = await validateDistribution(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.DistributionEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('DST', id) : body.code,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneDistributionById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        for (const id of ids) {
            let itemsIds = (await this.getItemsByDistributionId(id)).map(item => item.id);
            if (itemsIds.length > 0)
                await (0, utils_1.repo)(entities_1.DistributionItemEntity).delete(itemsIds);
            await (0, utils_1.repo)(entities_1.DistributionEntity).delete(id);
        }
        return { success: true };
    }
    async getItemById(id) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }
    async getItemsByDistributionId(distributionId) {
        return await queryAllItems()
            .where('item.distributionId = :distributionId', { distributionId })
            .getMany();
    }
};
exports.DistributionsController = DistributionsController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DistributionsController.prototype, "getAllDistributions", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DistributionsController.prototype, "getOneDistributionById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DistributionsController.prototype, "paginateDistribution", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DistributionsController.prototype, "createDistribution", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], DistributionsController.prototype, "updateDistribution", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DistributionsController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Get)('items/one/by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DistributionsController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)('items/many/by-distribution-id/:distributionId'),
    __param(0, (0, common_1.Param)('distributionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], DistributionsController.prototype, "getItemsByDistributionId", null);
exports.DistributionsController = DistributionsController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('distributions'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], DistributionsController);
async function validateDistribution(distribution) {
    let errors = [];
    let distributionDbCode = await (0, utils_1.repo)(entities_1.DistributionEntity).createQueryBuilder('distribution').where("distribution.code = :code", { code: `${distribution.code}` }).getOne();
    if (distributionDbCode && distributionDbCode.id != distribution.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.DistributionEntity)
        .createQueryBuilder('distribution')
        .leftJoinAndSelect('distribution.moneySourceId', 'moneySourceId')
        .leftJoinAndSelect('distribution.premiseId', 'premiseId')
        .leftJoinAndSelect('distribution.createdBy', 'createdBy')
        .leftJoinAndSelect('distribution.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('distribution.items', 'items')
        .leftJoinAndSelect('items.stockId', 'itemsStockId')
        .select([
        'distribution.id',
        'distribution.code',
        'distribution.cash',
        'distribution.totalQuantity',
        'distribution.totalAmount',
        'distribution.date',
        'distribution.notes',
        'distribution.createdAt',
        'distribution.lastUpdateAt',
        'moneySourceId',
        'premiseId',
        'createdBy',
        'lastUpdateBy',
        'items',
        'itemsStockId'
    ]).orderBy('items.id', 'ASC');
}
function queryAllItems() {
    return (0, utils_1.repo)(entities_1.DistributionItemEntity)
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.stockId', 'stockId')
        .leftJoinAndSelect('item.distributionId', 'distributionId')
        .select([
        'item.id',
        'item.quantity',
        'item.salePrice',
        'item.amount',
        'stockId',
        'distributionId'
    ]);
}
//# sourceMappingURL=distributions.controller.js.map