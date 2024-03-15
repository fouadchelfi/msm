import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { FenceEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
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
            result = result.where('fence.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('fence.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('fence.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('fence.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

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
            inStockQuantity: body.inStockQuantity,
            inStockQuantityAmount: body.inStockQuantityAmount,
            calculatedInStockQuantity: body.calculatedInStockQuantity,
            calculatedInStockQuantityAmount: body.calculatedInStockQuantityAmount,
            totalPurchaseAmount: body.totalPurchaseAmount,
            totalSaleAmount: body.totalSaleAmount,
            turnover: body.turnover,
            marginProfit: body.marginProfit,
            categoryId: body.categoryId,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbFence = await repo(FenceEntity).save(creation);

        if (isEmpty(dbFence.code)) await repo(FenceEntity).update(dbFence.id, { ...creation, code: code('CLR', dbFence.id) });


        //Sync database changes
        //..

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
            inStockQuantity: body.inStockQuantity,
            inStockQuantityAmount: body.inStockQuantityAmount,
            calculatedInStockQuantity: body.calculatedInStockQuantity,
            calculatedInStockQuantityAmount: body.calculatedInStockQuantityAmount,
            totalPurchaseAmount: body.totalPurchaseAmount,
            totalSaleAmount: body.totalSaleAmount,
            turnover: body.turnover,
            marginProfit: body.marginProfit,
            categoryId: body.categoryId,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
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
        .select(['fence.id', 'fence.code', 'fence.inStockQuantity', 'fence.calculatedInStockQuantity', 'fence.calculatedInStockQuantityAmount', 'fence.inStockQuantityAmount', 'fence.totalPurchaseAmount', 'fence.totalSaleAmount', 'fence.turnover', 'fence.marginProfit', 'categoryId', 'fence.date', 'fence.notes', 'fence.createdAt', 'fence.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}