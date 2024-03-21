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
exports.PurchasesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let PurchasesController = class PurchasesController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllPurchases() {
        return await queryAll().getMany();
    }
    async getOnePurchaseById(id) {
        return await queryAll()
            .where('purchase.id = :id', { id })
            .getOne();
    }
    async paginatePurchase(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.moneySourceId))
            result = result.where("purchase.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });
        if ((0, utils_1.isNotEmpty)(query.supplierId))
            result = result.andWhere("purchase.supplierId = :supplierId", { supplierId: query.supplierId });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(purchase.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(purchase.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(purchase.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(purchase.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`purchase.id`, query.order)
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
    async createPurchase(body, currentUser) {
        let errors = await validatePurchase(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            cost: body.cost,
            payment: body.payment,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            supplierId: body.supplierId,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbPurchase = await (0, utils_1.repo)(entities_1.PurchaseEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbPurchase.code))
            await (0, utils_1.repo)(entities_1.PurchaseEntity).update(dbPurchase.id, { ...creation, code: (0, utils_1.code)('ACH', dbPurchase.id) });
        body.items.map(item => item.purchaseId = parseInt(dbPurchase.id));
        await (0, utils_1.repo)(entities_1.PurchaseItemEntity).save(body.items);
        for (const item of body.items) {
            await this.manager.updateStockQuantity(item.stockId, item.quantity, 'add');
        }
        this.manager.updateSupplierDebt(creation.supplierId, parseFloat(creation.cost) - parseFloat(creation.payment), 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.payment, 'add');
        return {
            success: true,
            errors: [],
            data: await this.getOnePurchaseById(dbPurchase.id)
        };
    }
    async updatePurchase(id, body, currentUser) {
        let errors = await validatePurchase(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.PurchaseEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('ACH', id) : body.code,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOnePurchaseById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        for (const id of ids) {
            let itemsIds = (await this.getItemsByPurchaseId(id)).map(item => item.id);
            if (itemsIds.length > 0)
                await (0, utils_1.repo)(entities_1.PurchaseItemEntity).delete(itemsIds);
            await (0, utils_1.repo)(entities_1.PurchaseEntity).delete(id);
        }
        return { success: true };
    }
    async getItemById(id) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }
    async getItemsByPurchaseId(purchaseId) {
        return await queryAllItems()
            .where('item.purchaseId = :purchaseId', { purchaseId })
            .getMany();
    }
};
exports.PurchasesController = PurchasesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getAllPurchases", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getOnePurchaseById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "paginatePurchase", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "createPurchase", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "updatePurchase", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Get)('items/one/by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)('items/many/by-purchase-id/:purchaseId'),
    __param(0, (0, common_1.Param)('purchaseId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PurchasesController.prototype, "getItemsByPurchaseId", null);
exports.PurchasesController = PurchasesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('purchases'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], PurchasesController);
async function validatePurchase(purchase) {
    let errors = [];
    let purchaseDbCode = await (0, utils_1.repo)(entities_1.PurchaseEntity).createQueryBuilder('purchase').where("purchase.code = :code", { code: `${purchase.code}` }).getOne();
    if (purchaseDbCode && purchaseDbCode.id != purchase.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.PurchaseEntity)
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.moneySourceId', 'moneySourceId')
        .leftJoinAndSelect('purchase.supplierId', 'supplierId')
        .leftJoinAndSelect('purchase.createdBy', 'createdBy')
        .leftJoinAndSelect('purchase.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('purchase.items', 'items')
        .leftJoinAndSelect('items.stockId', 'itemsStockId')
        .select([
        'purchase.id',
        'purchase.code',
        'purchase.cost',
        'purchase.payment',
        'purchase.totalQuantity',
        'purchase.totalAmount',
        'purchase.date',
        'purchase.notes',
        'purchase.createdAt',
        'purchase.lastUpdateAt',
        'moneySourceId',
        'supplierId',
        'createdBy',
        'lastUpdateBy',
        'items',
        'itemsStockId'
    ]).orderBy('items.id', 'ASC');
}
function queryAllItems() {
    return (0, utils_1.repo)(entities_1.PurchaseItemEntity)
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.stockId', 'stockId')
        .leftJoinAndSelect('item.purchaseId', 'purchaseId')
        .select([
        'item.id',
        'item.quantity',
        'item.salePrice',
        'item.amount',
        'stockId',
        'purchaseId'
    ]);
}
//# sourceMappingURL=purchases.controller.js.map