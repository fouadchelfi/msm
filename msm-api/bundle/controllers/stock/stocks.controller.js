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
exports.StocksController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
let StocksController = class StocksController {
    async getAllStocks() {
        return await queryAll().getMany();
    }
    async getOneStockById(id) {
        return await queryAll()
            .where('stock.id = :id', { id })
            .getOne();
    }
    async paginateStock(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.label))
            result = result.where("TRIM(LOWER(stock.label)) LIKE :label", { label: `%${query.label.toLowerCase().trim()}%` });
        if ((0, utils_1.isNotEmpty)(query.categoryId))
            result = result.andWhere("stock.categoryId = :categoryId", { categoryId: `${query.categoryId}` });
        if ((0, utils_1.isNotEmpty)(query.familyId))
            result = result.andWhere("stock.familyId = :familyId", { familyId: `${query.familyId}` });
        if ((0, utils_1.isNotEmpty)(query.status))
            result = result.andWhere("stock.status = :status", { status: `${query.status}` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(stock.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(stock.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(stock.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(stock.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`stock.id`, query.order)
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
    async createStock(body, currentUser) {
        let errors = await validateStock(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            label: body.label,
            familyId: body.familyId,
            categoryId: body.categoryId,
            salePrice: body.salePrice,
            quantity: body.quantity,
            amount: body.amount,
            status: body.status,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbStock = await (0, utils_1.repo)(entities_1.StockEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbStock.code))
            await (0, utils_1.repo)(entities_1.StockEntity).update(dbStock.id, { ...creation, code: (0, utils_1.code)('STK', dbStock.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneStockById(dbStock.id)
        };
    }
    async updateStock(id, body, currentUser) {
        let errors = await validateStock(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.StockEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('STK', id) : body.code,
            label: body.label,
            familyId: body.familyId,
            categoryId: body.categoryId,
            salePrice: body.salePrice,
            quantity: body.quantity,
            amount: body.amount,
            status: body.status,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneStockById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.StockEntity).delete(ids);
        return { success: true };
    }
    async getStocksByStatus(status) {
        return await queryAll()
            .where('stock.status = :status', { status: status })
            .getMany();
    }
    async getFrozenStockByStockId(stockId) {
        let freeStock = await this.getOneStockById(stockId);
        return await queryAll()
            .where('stock.familyId = :familyId', { familyId: freeStock.familyId.id })
            .andWhere('stock.categoryId = :categoryId', { categoryId: freeStock.categoryId.id })
            .andWhere('stock.status = :status', { status: 'frozen' })
            .getOne();
    }
};
exports.StocksController = StocksController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getAllStocks", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getOneStockById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "paginateStock", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "createStock", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "updateStock", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Get)('many/by-status/:status'),
    __param(0, (0, common_1.Param)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getStocksByStatus", null);
__decorate([
    (0, common_1.Get)('one/frozen/:stockId'),
    __param(0, (0, common_1.Param)('stockId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], StocksController.prototype, "getFrozenStockByStockId", null);
exports.StocksController = StocksController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('stocks')
], StocksController);
async function validateStock(stock) {
    let errors = [];
    let stockDbCode = await (0, utils_1.repo)(entities_1.StockEntity).createQueryBuilder('stock').where("stock.code = :code", { code: `${stock.code}` }).getOne();
    if (stockDbCode && stockDbCode.id != stock.id)
        errors.push("Code existe déjà");
    let stockDbLabel = await (0, utils_1.repo)(entities_1.StockEntity).createQueryBuilder('stock').where("TRIM(LOWER(stock.label)) = :label", { label: `${stock.label?.toLowerCase().trim()}` }).getOne();
    if (stockDbLabel && stockDbLabel.id != stock.id)
        errors.push("Libellé existe déjà");
    let stockDb = await (0, utils_1.repo)(entities_1.StockEntity)
        .createQueryBuilder('stock')
        .where("stock.familyId = :familyId", { familyId: `${stock.familyId}` })
        .andWhere("stock.categoryId = :categoryId", { categoryId: `${stock.categoryId}` })
        .andWhere("stock.status = :status", { status: `${stock.status}` })
        .getOne();
    if (stockDb && stockDb.id != stock.id)
        errors.push("Un stock avec la même famille, catégorie et état existe déjà.");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.StockEntity)
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.createdBy', 'createdBy')
        .leftJoinAndSelect('stock.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('stock.categoryId', 'categoryId')
        .leftJoinAndSelect('stock.familyId', 'familyId')
        .select(['stock.id', 'stock.code', 'stock.label', 'stock.salePrice', 'stock.quantity', 'stock.amount', 'stock.status', 'stock.notes', 'stock.createdAt', 'stock.lastUpdateAt', 'categoryId', 'familyId', 'createdBy', 'lastUpdateBy']);
}
//# sourceMappingURL=stocks.controller.js.map