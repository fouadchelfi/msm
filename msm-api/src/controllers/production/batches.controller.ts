import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BatchEntity, BatchIngredientEntity, BatchItemEntity } from 'src/entities';
import { ManagerService } from 'src/services';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('batches')
export class BatchesController {

    constructor(private manager: ManagerService) { }

    @Get('all')
    async getAllBatches() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneBatchById(@Param('id') id: number) {
        return await queryAll()
            .where('batch.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateBatch(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.moneySourceId))
            result = result.where("batch.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('batch.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('batch.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('batch.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('batch.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

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

    @Post('create')
    async createBatch(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateBatch(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            cash: body.cash,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbBatch = await repo(BatchEntity).save(creation);

        if (isEmpty(dbBatch.code)) await repo(BatchEntity).update(dbBatch.id, { ...creation, code: code('RLC', dbBatch.id) });

        //Asigne batch id to every item.
        (<any[]>body.items).map(item => item.batchId = parseInt(dbBatch.id));
        //Save items
        await repo(BatchItemEntity).save(body.items);

        //Asigne batch id to every ingredient.
        (<any[]>body.ingredients).map(ingredient => ingredient.batchId = parseInt(dbBatch.id));
        //Save ingredients
        await repo(BatchIngredientEntity).save(body.ingredients);

        //Sync database changes
        for (const item of (<any[]>body.items)) {
            await this.manager.updateStockQuantity(item.stockId, item.quantity, 'add');
        }
        // this.manager.updatePremiseDebt(creation.premiseId, parseFloat(creation.cost) - parseFloat(creation.payment), 'add');
        // this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.payment, 'add');

        return {
            success: true,
            errors: [],
            data: await this.getOneBatchById(dbBatch.id)
        };
    }

    @Put('one/update/:id')
    async updateBatch(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateBatch(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(BatchEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('RLC', id) : body.code,
            //...
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneBatchById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        for (const id of ids) {
            let itemsIds = (<any[]>(await this.getItemsByBatchId(id))).map(item => (<number>item.id));
            if (itemsIds.length > 0) await repo(BatchItemEntity).delete(itemsIds);
            await repo(BatchEntity).delete(id);
        }
        return { success: true };
    }

    @Get('items/one/by-id/:id')
    async getItemById(@Param('id') id: number) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }

    @Get('ingredients/one/by-id/:id')
    async getIngredientById(@Param('id') id: number) {
        return await queryAllIngredients()
            .where('ingredient.id = :id', { id })
            .getOne();
    }

    @Get('items/many/by-batch-id/:batchId')
    async getItemsByBatchId(@Param('batchId') batchId: number) {
        return await queryAllItems()
            .where('item.batchId = :batchId', { batchId })
            .getMany();
    }

    @Get('ingredients/many/by-batch-id/:batchId')
    async getIngredientsByBatchId(@Param('batchId') batchId: number) {
        return await queryAllItems()
            .where('ingredient.batchId = :batchId', { batchId })
            .getMany();
    }
}

async function validateBatch(batch) {
    let errors = [];

    let batchDbCode = await repo(BatchEntity).createQueryBuilder('batch').where("batch.code = :code", { code: `${(<string>batch.code)}` }).getOne();
    if (batchDbCode && batchDbCode.id != batch.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(BatchEntity)
        .createQueryBuilder('batch')
        .leftJoinAndSelect('batch.moneySourceId', 'moneySourceId')
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
            'batch.totalAmount',
            'batch.date',
            'batch.notes',
            'batch.createdAt',
            'batch.lastUpdateAt',
            'moneySourceId',
            'createdBy',
            'lastUpdateBy',
            'items',
            'itemsStockId',
            'ingredients',
            'ingredientsIngredientId'
        ]).orderBy('items.id', 'ASC');
}

function queryAllItems() {
    return repo(BatchItemEntity)
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
    return repo(BatchItemEntity)
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