import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { BatchEntity, BatchItemEntity, ChargeEntity, CustomerEntity, DistributionItemEntity, EmployeeEntity, EmployeePaymentEntity, FenceEntity, LosseEntity, PremiseReturnItemEntity, PurchaseItemEntity, SaleItemEntity, StockEntity, SupplierEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('fences')
export class FencesController {

    @Get('all')
    async getAllFences() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneFenceById(@Param('id') id: number) {
        return await queryAll()
            .where('fence.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateFence(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.categoryId))
            result = result
                .where("fence.categoryId.id = :categoryId", { categoryId: `${query.categoryId}` })

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.andWhere('DATE(fence.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(fence.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
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

    @Post('create')
    async createFence(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateFence(body);
        if (errors) return { success: false, errors: errors, data: null };

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
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbFence = await repo(FenceEntity).save(creation);

        if (isEmpty(dbFence.code)) await repo(FenceEntity).update(dbFence.id, { ...creation, code: code('CLR', dbFence.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneFenceById(dbFence.id)
        };
    }

    @Put('one/update/:id')
    async updateFence(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateFence(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(FenceEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('CLR', id) : body.code,
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
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneFenceById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        await repo(FenceEntity).delete(ids);
        return { success: true };
    }

    @Get('purchases/total/:categoryId')
    async getPurchasesTotalCost(@Param('categoryId') categoryId: number) {
        let query = await repo(PurchaseItemEntity)
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.stockId', 'stockId')
            .leftJoinAndSelect('item.purchaseId', 'purchaseId');

        if (categoryId != 0)
            query = await query.where('stockId.categoryId = :categoryId', { categoryId: categoryId });

        return await query.select("SUM(purchaseId.cost)", "total").getRawOne();
    }

    @Get('sales/customers/total/:categoryId')
    async getCustomersSalesTotalAmount(@Param('categoryId') categoryId: number) {
        let query = await repo(SaleItemEntity)
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.stockId', 'stockId')
            .leftJoinAndSelect('item.saleId', 'saleId');

        if (categoryId != 0)
            query = await query.where('stockId.categoryId = :categoryId', { categoryId: categoryId });

        return await query.select("SUM(saleId.totalAmount)", "total").getRawOne();
    }

    @Get('sales/premises/total/:categoryId')
    async getDistrgetPremisesSalesTotalAmountibutionsTotalAmount(@Param('categoryId') categoryId: number) {
        let distributionQuery = await repo(DistributionItemEntity)
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.stockId', 'stockId')
            .leftJoinAndSelect('item.distributionId', 'distributionId');
        let returnQuery = await repo(PremiseReturnItemEntity)
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

    @Get('batches/total/:categoryId')
    async getBatchesTotalAmount(@Param('categoryId') categoryId: number) {
        let query = await repo(BatchEntity)
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
        }
    }

    @Get('stocks/total-quantity/:categoryId')
    async getStocksTotalQuantity(@Param('categoryId') categoryId: number) {
        let query = await repo(StockEntity)
            .createQueryBuilder('stock');

        if (categoryId != 0)
            query = await query.where('stock.categoryId = :categoryId', { categoryId: categoryId });

        return await query.select("SUM(stock.quantity)", "total").getRawOne();
    }

    @Get('stocks/total-amount/:categoryId')
    async getStocksTotalAmount(@Param('categoryId') categoryId: number) {
        let query = await repo(StockEntity)
            .createQueryBuilder('stock');

        if (categoryId != 0)
            query = await query.where('stock.categoryId = :categoryId', { categoryId: categoryId });

        return await query.select("SUM(stock.quantity * stock.salePrice)", "total").getRawOne();
    }

    @Get('charges/total')
    async getChargesTotalAmount() {
        return await repo(ChargeEntity)
            .createQueryBuilder('charge')
            .select("SUM(charge.amount)", "total")
            .getRawOne();
    }

    @Get('losses/total')
    async getLossesTotalAmount() {
        return await repo(LosseEntity)
            .createQueryBuilder('losse')
            .select("SUM(losse.amount)", "total")
            .getRawOne();
    }

    @Get('employees-payments/total')
    async getEmployeesTotalPayments() {
        return await repo(EmployeePaymentEntity)
            .createQueryBuilder('payment')
            .select("SUM(payment.calculatedPayment)", "total")
            .getRawOne();
    }

    @Get('employees-debts/total')
    async getEmployeesTotalDebts() {
        return await repo(EmployeeEntity)
            .createQueryBuilder('employee')
            .select("SUM(employee.debt)", "total")
            .getRawOne();
    }

    @Get('suppliers-debts/total')
    async getSuppliersTotalDebts() {
        return await repo(SupplierEntity)
            .createQueryBuilder('supplier')
            .select("SUM(supplier.debt)", "total")
            .getRawOne();
    }

    @Get('customers-debts/total')
    async getCustomersTotalDebts() {
        return await repo(CustomerEntity)
            .createQueryBuilder('customer')
            .select("SUM(customer.debt)", "total")
            .getRawOne();
    }
}

async function validateFence(fence) {
    let errors = [];

    let fenceDbCode = await repo(FenceEntity).createQueryBuilder('fence').where("fence.code = :code", { code: `${(<string>fence.code)}` }).getOne();
    if (fenceDbCode && fenceDbCode.id != fence.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(FenceEntity)
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