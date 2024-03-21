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
exports.BatchesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const services_1 = require("../../services");
const utils_1 = require("../../utils");
let BatchesController = class BatchesController {
    constructor(manager) {
        this.manager = manager;
    }
    async getAllBatches() {
        return await queryAll().getMany();
    }
    async getOneBatchById(id) {
        return await queryAll()
            .where('batch.id = :id', { id })
            .getOne();
    }
    async paginateBatch(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.productId))
            result = result.where("batch.productId = :productId", { productId: query.productId });
        if ((0, utils_1.isNotEmpty)(query.moneySourceId))
            result = result.where("batch.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(batch.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(batch.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(batch.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(batch.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`batch.id`, query.order)
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
    async createBatch(body, currentUser) {
        let errors = await validateBatch(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            cash: body.cash,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            productId: body.productId,
            quantity: body.quantity,
            date: body.date,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbBatch = await (0, utils_1.repo)(entities_1.BatchEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbBatch.code))
            await (0, utils_1.repo)(entities_1.BatchEntity).update(dbBatch.id, { ...creation, code: (0, utils_1.code)('LOT', dbBatch.id) });
        body.items.map(item => item.batchId = parseInt(dbBatch.id));
        await (0, utils_1.repo)(entities_1.BatchItemEntity).save(body.items);
        body.ingredients.map(ingredient => ingredient.batchId = parseInt(dbBatch.id));
        await (0, utils_1.repo)(entities_1.BatchIngredientEntity).save(body.ingredients);
        for (const item of body.items) {
            await this.manager.updateStockQuantity(item.stockId, -item.quantity, 'add');
        }
        this.manager.updateStockQuantity(creation.productId, parseFloat(creation.quantity), 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.totalAmount, 'add');
        return {
            success: true,
            errors: [],
            data: await this.getOneBatchById(dbBatch.id)
        };
    }
    async updateBatch(id, body, currentUser) {
        let errors = await validateBatch(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.BatchEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('LOT', id) : body.code,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneBatchById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        for (const id of ids) {
            let itemsIds = (await this.getItemsByBatchId(id)).map(item => item.id);
            if (itemsIds.length > 0)
                await (0, utils_1.repo)(entities_1.BatchItemEntity).delete(itemsIds);
            await (0, utils_1.repo)(entities_1.BatchEntity).delete(id);
        }
        return { success: true };
    }
    async getItemById(id) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }
    async getIngredientById(id) {
        return await queryAllIngredients()
            .where('ingredient.id = :id', { id })
            .getOne();
    }
    async getItemsByBatchId(batchId) {
        return await queryAllItems()
            .where('item.batchId = :batchId', { batchId })
            .getMany();
    }
    async getIngredientsByBatchId(batchId) {
        return await queryAllItems()
            .where('ingredient.batchId = :batchId', { batchId })
            .getMany();
    }
};
exports.BatchesController = BatchesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "getAllBatches", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "getOneBatchById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "paginateBatch", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "createBatch", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "updateBatch", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Get)('items/one/by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "getItemById", null);
__decorate([
    (0, common_1.Get)('ingredients/one/by-id/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "getIngredientById", null);
__decorate([
    (0, common_1.Get)('items/many/by-batch-id/:batchId'),
    __param(0, (0, common_1.Param)('batchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "getItemsByBatchId", null);
__decorate([
    (0, common_1.Get)('ingredients/many/by-batch-id/:batchId'),
    __param(0, (0, common_1.Param)('batchId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BatchesController.prototype, "getIngredientsByBatchId", null);
exports.BatchesController = BatchesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('batches'),
    __metadata("design:paramtypes", [services_1.ManagerService])
], BatchesController);
async function validateBatch(batch) {
    let errors = [];
    let batchDbCode = await (0, utils_1.repo)(entities_1.BatchEntity).createQueryBuilder('batch').where("batch.code = :code", { code: `${batch.code}` }).getOne();
    if (batchDbCode && batchDbCode.id != batch.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.BatchEntity)
        .createQueryBuilder('batch')
        .leftJoinAndSelect('batch.moneySourceId', 'moneySourceId')
        .leftJoinAndSelect('batch.productId', 'productId')
        .leftJoinAndSelect('batch.createdBy', 'createdBy')
        .leftJoinAndSelect('batch.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('batch.items', 'items')
        .leftJoinAndSelect('items.stockId', 'itemsStockId')
        .leftJoinAndSelect('batch.ingredients', 'ingredients')
        .leftJoinAndSelect('ingredients.ingredientId', 'ingredientsIngredientId')
        .select([
        'batch.id',
        'batch.code',
        'batch.totalQuantity',
        'batch.quantity',
        'batch.totalAmount',
        'batch.date',
        'batch.notes',
        'batch.createdAt',
        'batch.lastUpdateAt',
        'moneySourceId',
        'productId',
        'createdBy',
        'lastUpdateBy',
        'items',
        'itemsStockId',
        'ingredients',
        'ingredientsIngredientId'
    ]).orderBy('items.id', 'ASC');
}
function queryAllItems() {
    return (0, utils_1.repo)(entities_1.BatchItemEntity)
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.stockId', 'stockId')
        .leftJoinAndSelect('item.batchId', 'batchId')
        .select([
        'item.id',
        'item.quantity',
        'item.amount',
        'stockId',
        'batchId'
    ]);
}
function queryAllIngredients() {
    return (0, utils_1.repo)(entities_1.BatchItemEntity)
        .createQueryBuilder('ingredient')
        .leftJoinAndSelect('ingredient.ingredientId', 'ingredientId')
        .leftJoinAndSelect('ingredient.batchId', 'batchId')
        .select([
        'ingredient.id',
        'ingredient.quantity',
        'ingredient.amount',
        'ingredientId',
        'batchId'
    ]);
}
//# sourceMappingURL=batches.controller.js.map