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
exports.FencesController = void 0;
const common_1 = require("@nestjs/common");
const entities_1 = require("../../entities");
const utils_1 = require("../../utils");
let FencesController = class FencesController {
    async getAllFences() {
        return await queryAll().getMany();
    }
    async getOneFenceById(id) {
        return await queryAll()
            .where('fence.id = :id', { id })
            .getOne();
    }
    async paginateFence(query) {
        let result = queryAll();
        if ((0, utils_1.isNotEmpty)(query.categoryId))
            result = result
                .where("fence.categoryId.id = :categoryId", { categoryId: `${query.categoryId}` });
        if ((0, utils_1.isNotEmpty)(query.fromCreatedAt) && (0, utils_1.isNotEmpty)(query.toCreatedAt))
            result = result.andWhere('DATE(fence.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(fence.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });
        if ((0, utils_1.isNotEmpty)(query.fromLastUpdateAt) && (0, utils_1.isNotEmpty)(query.toLastUpdateAt))
            result = result.andWhere('DATE(fence.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(fence.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });
        result = await result
            .orderBy(`fence.id`, query.order)
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
    async createFence(body, currentUser) {
        let errors = await validateFence(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        let creation = {
            code: body.code,
            categoryId: body.categoryId,
            date: body.date,
            inStockQuantity: body.inStockQuantity,
            inStockAmount: body.inStockAmount,
            calculatedInStockQuantity: body.calculatedInStockQuantity,
            calculatedInStockAmount: body.calculatedInStockAmount,
            totalSaleAmount: body.totalSaleAmount,
            totalPurchaseAmount: body.totalPurchaseAmount,
            totalCharges: body.totalCharges,
            totalLosses: body.totalLosses,
            totalEmployeesPayments: body.totalEmployeesPayments,
            totalEmployeesDebts: body.totalEmployeesDebts,
            totalSuppliersDebts: body.totalSuppliersDebts,
            totalCustomersDebts: body.totalCustomersDebts,
            totalBatchesStocksAmount: body.totalBatchesStocksAmount,
            totalBatchesIngredientsAmount: body.totalBatchesIngredientsAmount,
            marginProfit: body.marginProfit,
            rawProfit: body.rawProfit,
            notes: body.notes,
            createdAt: (0, utils_1.currentDateTime)(),
            createdBy: currentUser?.id,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        };
        let dbFence = await (0, utils_1.repo)(entities_1.FenceEntity).save(creation);
        if ((0, utils_1.isEmpty)(dbFence.code))
            await (0, utils_1.repo)(entities_1.FenceEntity).update(dbFence.id, { ...creation, code: (0, utils_1.code)('CLR', dbFence.id) });
        return {
            success: true,
            errors: [],
            data: await this.getOneFenceById(dbFence.id)
        };
    }
    async updateFence(id, body, currentUser) {
        let errors = await validateFence(body);
        if (errors)
            return { success: false, errors: errors, data: null };
        await (0, utils_1.repo)(entities_1.FenceEntity).update(body.id, {
            id: body.id,
            code: (0, utils_1.isEmpty)(body.code) ? (0, utils_1.code)('CLR', id) : body.code,
            categoryId: body.categoryId,
            date: body.date,
            inStockQuantity: body.inStockQuantity,
            inStockAmount: body.inStockAmount,
            calculatedInStockQuantity: body.calculatedInStockQuantity,
            calculatedInStockAmount: body.calculatedInStockAmount,
            totalSaleAmount: body.totalSaleAmount,
            totalPurchaseAmount: body.totalPurchaseAmount,
            totalCharges: body.totalCharges,
            totalLosses: body.totalLosses,
            totalEmployeesPayments: body.totalEmployeesPayments,
            totalEmployeesDebts: body.totalEmployeesDebts,
            totalSuppliersDebts: body.totalSuppliersDebts,
            totalCustomersDebts: body.totalCustomersDebts,
            totalBatchesStocksAmount: body.totalBatchesStocksAmount,
            totalBatchesIngredientsAmount: body.totalBatchesIngredientsAmount,
            marginProfit: body.marginProfit,
            rawProfit: body.rawProfit,
            notes: body.notes,
            lastUpdateAt: (0, utils_1.currentDateTime)(),
            lastUpdateBy: currentUser?.id,
        });
        return {
            success: true,
            errors: [],
            data: await this.getOneFenceById(body.id)
        };
    }
    async deleteMany(query) {
        let ids = Object.values(query.id).map(id => parseInt(id));
        await (0, utils_1.repo)(entities_1.FenceEntity).delete(ids);
        return { success: true };
    }
    async getPurchasesTotalCost(categoryId) {
        let query = await (0, utils_1.repo)(entities_1.PurchaseItemEntity)
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.stockId', 'stockId')
            .leftJoinAndSelect('item.purchaseId', 'purchaseId');
        if (categoryId != 0)
            query = await query.where('stockId.categoryId = :categoryId', { categoryId: categoryId });
        return await query.select("SUM(purchaseId.cost)", "total").getRawOne();
    }
    async getCustomersSalesTotalAmount(categoryId) {
        let query = await (0, utils_1.repo)(entities_1.SaleItemEntity)
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.stockId', 'stockId')
            .leftJoinAndSelect('item.saleId', 'saleId');
        if (categoryId != 0)
            query = await query.where('stockId.categoryId = :categoryId', { categoryId: categoryId });
        return await query.select("SUM(saleId.totalAmount)", "total").getRawOne();
    }
    async getDistrgetPremisesSalesTotalAmountibutionsTotalAmount(categoryId) {
        let distributionQuery = await (0, utils_1.repo)(entities_1.DistributionItemEntity)
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.stockId', 'stockId')
            .leftJoinAndSelect('item.distributionId', 'distributionId');
        let returnQuery = await (0, utils_1.repo)(entities_1.PremiseReturnItemEntity)
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.stockId', 'stockId')
            .leftJoinAndSelect('item.premiseReturnId', 'premiseReturnId');
        if (categoryId != 0)
            distributionQuery = await distributionQuery.where('stockId.categoryId = :categoryId', { categoryId: categoryId });
        if (categoryId != 0)
            returnQuery = await returnQuery.where('stockId.categoryId = :categoryId', { categoryId: categoryId });
        let totalDistribution = parseFloat((await distributionQuery.select("SUM(distributionId.totalAmount)", "total").getRawOne()).total);
        let totalReturns = parseFloat((await returnQuery.select("SUM(premiseReturnId.totalAmount)", "total").getRawOne()).total);
        return { total: totalDistribution - totalReturns };
    }
    async getBatchesTotalAmount(categoryId) {
        let query = await (0, utils_1.repo)(entities_1.BatchEntity)
            .createQueryBuilder('batch')
            .leftJoinAndSelect('batch.productId', 'productId');
        if (categoryId != 0)
            query = await query.where('productId.categoryId = :categoryId', { categoryId: categoryId });
        let totalIngredients = (await query
            .leftJoinAndSelect('batch.ingredients', 'ingredients')
            .select('SUM(ingredients.amount) AS "total"')
            .getRawOne()).total;
        let totalItems = (await query.leftJoinAndSelect('batch.items', 'items')
            .select('SUM(items.amount) AS "total"')
            .getRawOne()).total;
        return await {
            totalItems: totalItems,
            totalIngredients: totalIngredients,
        };
    }
    async getStocksTotalQuantity(categoryId) {
        let query = await (0, utils_1.repo)(entities_1.StockEntity)
            .createQueryBuilder('stock');
        if (categoryId != 0)
            query = await query.where('stock.categoryId = :categoryId', { categoryId: categoryId });
        return await query.select("SUM(stock.quantity)", "total").getRawOne();
    }
    async getStocksTotalAmount(categoryId) {
        let query = await (0, utils_1.repo)(entities_1.StockEntity)
            .createQueryBuilder('stock');
        if (categoryId != 0)
            query = await query.where('stock.categoryId = :categoryId', { categoryId: categoryId });
        return await query.select("SUM(stock.quantity * stock.salePrice)", "total").getRawOne();
    }
    async getChargesTotalAmount() {
        return await (0, utils_1.repo)(entities_1.ChargeEntity)
            .createQueryBuilder('charge')
            .select("SUM(charge.amount)", "total")
            .getRawOne();
    }
    async getLossesTotalAmount() {
        return await (0, utils_1.repo)(entities_1.LosseEntity)
            .createQueryBuilder('losse')
            .select("SUM(losse.amount)", "total")
            .getRawOne();
    }
    async getEmployeesTotalPayments() {
        return await (0, utils_1.repo)(entities_1.EmployeePaymentEntity)
            .createQueryBuilder('payment')
            .select("SUM(payment.calculatedPayment)", "total")
            .getRawOne();
    }
    async getEmployeesTotalDebts() {
        return await (0, utils_1.repo)(entities_1.EmployeeEntity)
            .createQueryBuilder('employee')
            .select("SUM(employee.debt)", "total")
            .getRawOne();
    }
    async getSuppliersTotalDebts() {
        return await (0, utils_1.repo)(entities_1.SupplierEntity)
            .createQueryBuilder('supplier')
            .select("SUM(supplier.debt)", "total")
            .getRawOne();
    }
    async getCustomersTotalDebts() {
        return await (0, utils_1.repo)(entities_1.CustomerEntity)
            .createQueryBuilder('customer')
            .select("SUM(customer.debt)", "total")
            .getRawOne();
    }
};
exports.FencesController = FencesController;
__decorate([
    (0, common_1.Get)('all'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getAllFences", null);
__decorate([
    (0, common_1.Get)('one/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getOneFenceById", null);
__decorate([
    (0, common_1.Get)('pagination'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "paginateFence", null);
__decorate([
    (0, common_1.Post)('create'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "createFence", null);
__decorate([
    (0, common_1.Put)('one/update/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, utils_1.GetCurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "updateFence", null);
__decorate([
    (0, common_1.Delete)('many'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "deleteMany", null);
__decorate([
    (0, common_1.Get)('purchases/total/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getPurchasesTotalCost", null);
__decorate([
    (0, common_1.Get)('sales/customers/total/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getCustomersSalesTotalAmount", null);
__decorate([
    (0, common_1.Get)('sales/premises/total/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getDistrgetPremisesSalesTotalAmountibutionsTotalAmount", null);
__decorate([
    (0, common_1.Get)('batches/total/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getBatchesTotalAmount", null);
__decorate([
    (0, common_1.Get)('stocks/total-quantity/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getStocksTotalQuantity", null);
__decorate([
    (0, common_1.Get)('stocks/total-amount/:categoryId'),
    __param(0, (0, common_1.Param)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getStocksTotalAmount", null);
__decorate([
    (0, common_1.Get)('charges/total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getChargesTotalAmount", null);
__decorate([
    (0, common_1.Get)('losses/total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getLossesTotalAmount", null);
__decorate([
    (0, common_1.Get)('employees-payments/total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getEmployeesTotalPayments", null);
__decorate([
    (0, common_1.Get)('employees-debts/total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getEmployeesTotalDebts", null);
__decorate([
    (0, common_1.Get)('suppliers-debts/total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getSuppliersTotalDebts", null);
__decorate([
    (0, common_1.Get)('customers-debts/total'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FencesController.prototype, "getCustomersTotalDebts", null);
exports.FencesController = FencesController = __decorate([
    (0, common_1.UseGuards)(utils_1.AuthGuard),
    (0, common_1.Controller)('fences')
], FencesController);
async function validateFence(fence) {
    let errors = [];
    let fenceDbCode = await (0, utils_1.repo)(entities_1.FenceEntity).createQueryBuilder('fence').where("fence.code = :code", { code: `${fence.code}` }).getOne();
    if (fenceDbCode && fenceDbCode.id != fence.id)
        errors.push("Code existe déjà");
    return errors.length == 0 ? null : errors;
}
function queryAll() {
    return (0, utils_1.repo)(entities_1.FenceEntity)
        .createQueryBuilder('fence')
        .leftJoinAndSelect('fence.createdBy', 'createdBy')
        .leftJoinAndSelect('fence.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('fence.categoryId', 'categoryId')
        .select([
        'fence.id',
        'fence.code',
        'categoryId',
        'fence.date',
        'fence.inStockQuantity',
        'fence.inStockAmount',
        'fence.calculatedInStockQuantity',
        'fence.calculatedInStockAmount',
        'fence.totalCustomersSaleAmount',
        'fence.totalPremisesSaleAmount',
        'fence.totalPurchaseAmount',
        'fence.totalCharges',
        'fence.totalLosses',
        'fence.totalEmployeesPayments',
        'fence.totalEmployeesDebts',
        'fence.totalSuppliersDebts',
        'fence.totalCustomersDebts',
        'fence.totalBatchesStocksAmount',
        'fence.totalBatchesIngredientsAmount',
        'fence.marginProfit',
        'fence.rawProfit',
        'fence.notes',
        'fence.createdAt',
        'fence.lastUpdateAt',
        'createdBy',
        'lastUpdateBy'
    ]);
}
//# sourceMappingURL=fences.controller.js.map