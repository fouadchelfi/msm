import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { StockEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('stocks')
export class StocksController {

    @Get('all')
    async getAllStocks() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneStockById(@Param('id') id: number) {
        return await queryAll()
            .where('stock.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateStock(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(stock.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('stock.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('stock.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('stock.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('stock.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

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

    @Post('create')
    async createStock(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateStock(body);
        if (errors) return { success: false, errors: errors, data: null };

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
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbStock = await repo(StockEntity).save(creation);

        if (isEmpty(dbStock.code)) await repo(StockEntity).update(dbStock.id, { ...creation, code: code('STK', dbStock.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneStockById(dbStock.id)
        };
    }

    @Put('one/update/:id')
    async updateStock(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateStock(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(StockEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('STK', id) : body.code,
            label: body.label,
            familyId: body.familyId,
            categoryId: body.categoryId,
            salePrice: body.salePrice,
            quantity: body.quantity,
            amount: body.amount,
            status: body.status,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneStockById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        await repo(StockEntity).delete(ids);
        return { success: true };
    }

    @Get('many/by-status/:status')
    async getStocksByStatus(@Param('status') status) {
        return await queryAll()
            .where('stock.status = :status', { status: status })
            .getMany();
    }

    @Get('one/frozen/:stockId')
    async getFrozenStockByStockId(@Param('stockId') stockId: number) {
        let freeStock = await this.getOneStockById(stockId);
        return await queryAll()
            .where('stock.familyId = :familyId', { familyId: freeStock.familyId.id })
            .andWhere('stock.categoryId = :categoryId', { categoryId: freeStock.categoryId.id })
            .andWhere('stock.status = :status', { status: 'frozen' })
            .getOne();
    }
}

async function validateStock(stock) {
    let errors = [];

    let stockDbCode = await repo(StockEntity).createQueryBuilder('stock').where("stock.code = :code", { code: `${(<string>stock.code)}` }).getOne();
    if (stockDbCode && stockDbCode.id != stock.id)
        errors.push("Code existe déjà");

    let stockDbLabel = await repo(StockEntity).createQueryBuilder('stock').where("TRIM(LOWER(stock.label)) = :label", { label: `${(<string>stock.label)?.toLowerCase().trim()}` }).getOne();
    if (stockDbLabel && stockDbLabel.id != stock.id)
        errors.push("Libellé existe déjà");

    let stockDb = await repo(StockEntity)
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
    return repo(StockEntity)
        .createQueryBuilder('stock')
        .leftJoinAndSelect('stock.createdBy', 'createdBy')
        .leftJoinAndSelect('stock.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('stock.categoryId', 'categoryId')
        .leftJoinAndSelect('stock.familyId', 'familyId')
        .select(['stock.id', 'stock.code', 'stock.label', 'stock.salePrice', 'stock.quantity', 'stock.amount', 'stock.status', 'stock.notes', 'stock.createdAt', 'stock.lastUpdateAt', 'categoryId', 'familyId', 'createdBy', 'lastUpdateBy']);
}