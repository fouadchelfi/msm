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
exports.SalesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let SalesController = class SalesController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllSales() {
        return await queryAll().getMany();
    }
    async getOneSaleById(id) {
        return await queryAll()
            .where('sale.id = :id', { id })
            .getOne();
    }
    async paginateSale(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.moneySourceId))
            result = result.where("sale.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });
        if ((0, utils_1.isNotEmpty)(query.customerId))
            result = result.andWhere("sale.customerId = :customerId", { customerId: query.customerId });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(sale.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(sale.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(sale.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(sale.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`sale.id`, query.order)
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
    async createSale(body, currentUser) {
        let errors = await validateSale(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            deliveryAmount: body.deliveryAmount,
            payment: body.payment,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            customerId: body.customerId,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbSale = await (0, utils_1.repo)(entities_1.SaleEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbSale.code))
            await (0, utils_1.repo)(entities_1.SaleEntity).update(dbSale.id, { ...creation, code: (0, utils_1.code)('VNT', dbSale.id) });
        body.items.map(item => item.saleId = parseInt(dbSale.id));
        await (0, utils_1.repo)(entities_1.SaleItemEntity).save(body.items);
        for (const item of body.items) {
            await this.manager.updateStockQuantity(item.stockId, -item.quantity, 'add');
        }
        this.manager.updateCustomerDebt(creation.customerId, parseFloat(creation.totalAmount) - parseFloat(creation.payment), 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, creation.payment, 'add');
        return {
            success: true,
            errors: [],
            data: await this.getOneSaleById(dbSale.id)
        };
    }
    async updateSale(id, body, currentUser) {
        let errors = await validateSale(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.SaleEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('VNT', id) : body.code,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneSaleById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        for (const id of ids) {
            let itemsIds = (await this.getItemsBySaleId(id)).map(item => item.id);
            if (itemsIds.length > 0)
                await (0, utils_1.repo)(entities_1.SaleItemEntity).delete(itemsIds);
            await (0, utils_1.repo)(entities_1.SaleEntity).delete(id);
        }
        return { success: true };
    }
    async getItemById(id) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }
    async getItemsBySaleId(saleId) {
        return await queryAllItems()
            .where('item.saleId = :saleId', { saleId })
            .getMany();
    }
};
exports.SalesController = SalesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getAllSales", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getOneSaleById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "paginateSale", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "createSale", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "updateSale", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Get)('items/one/by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)('items/many/by-sale-id/:saleId'),
    __param(0, (0, common_1.Param)('saleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], SalesController.prototype, "getItemsBySaleId", null);
exports.SalesController = SalesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('sales'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], SalesController);
async function validateSale(sale) {
    let errors = [];
    let saleDbCode = await (0, utils_1.repo)(entities_1.SaleEntity).createQueryBuilder('sale').where("sale.code = :code", { code: `${sale.code}` }).getOne();
    if (saleDbCode && saleDbCode.id != sale.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.SaleEntity)
        .createQueryBuilder('sale')
        .leftJoinAndSelect('sale.moneySourceId', 'moneySourceId')
        .leftJoinAndSelect('sale.customerId', 'customerId')
        .leftJoinAndSelect('sale.createdBy', 'createdBy')
        .leftJoinAndSelect('sale.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('sale.items', 'items')
        .leftJoinAndSelect('items.stockId', 'itemsStockId')
        .select([
        'sale.id',
        'sale.code',
        'sale.deliveryAmount',
        'sale.payment',
        'sale.totalQuantity',
        'sale.totalAmount',
        'sale.date',
        'sale.notes',
        'sale.createdAt',
        'sale.lastUpdateAt',
        'moneySourceId',
        'customerId',
        'createdBy',
        'lastUpdateBy',
        'items',
        'itemsStockId'
    ]).orderBy('items.id', 'ASC');
}
function queryAllItems() {
    return (0, utils_1.repo)(entities_1.SaleItemEntity)
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.stockId', 'stockId')
        .leftJoinAndSelect('item.saleId', 'saleId')
        .select([
        'item.id',
        'item.quantity',
        'item.salePrice',
        'item.amount',
        'stockId',
        'saleId'
    ]);
}
//# sourceMappingURL=sales.controller.js.map