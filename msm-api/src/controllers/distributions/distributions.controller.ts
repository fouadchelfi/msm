import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { DistributionEntity, DistributionItemEntity } from 'src/entities';
import { ManagerService } from 'src/services';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('distributions')
export class DistributionsController {

    constructor(private manager: ManagerService) { }

    @Get('all')
    async getAllDistributions() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneDistributionById(@Param('id') id: number) {
        return await queryAll()
            .where('distribution.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateDistribution(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.moneySourceId))
            result = result.where("distribution.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });

        if (isNotEmpty(query.premiseId))
            result = result.andWhere("distribution.premiseId = :premiseId", { premiseId: query.premiseId });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('distribution.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('distribution.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('distribution.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('distribution.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

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

    @Post('create')
    async createDistribution(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateDistribution(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            cash: body.cash,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            premiseId: body.premiseId,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbDistribution = await repo(DistributionEntity).save(creation);

        if (isEmpty(dbDistribution.code)) await repo(DistributionEntity).update(dbDistribution.id, { ...creation, code: code('ACH', dbDistribution.id) });

        //Asigne distribution id to every item.
        (<any[]>body.items).map(item => item.distributionId = parseInt(dbDistribution.id));
        //Save items
        await repo(DistributionItemEntity).save(body.items);

        //Sync database changes
        for (const item of (<any[]>body.items)) {
            await this.manager.updateStockQuantity(item.stockId, item.quantity, 'add');
        }
        // this.manager.updatePremiseDebt(creation.premiseId, parseFloat(creation.cost) - parseFloat(creation.payment), 'add');
        // this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.payment, 'add');

        return {
            success: true,
            errors: [],
            data: await this.getOneDistributionById(dbDistribution.id)
        };
    }

    @Put('one/update/:id')
    async updateDistribution(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateDistribution(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(DistributionEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('ACH', id) : body.code,
            //...
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneDistributionById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        for (const id of ids) {
            let itemsIds = (<any[]>(await this.getItemsByDistributionId(id))).map(item => (<number>item.id));
            if (itemsIds.length > 0) await repo(DistributionItemEntity).delete(itemsIds);
            await repo(DistributionEntity).delete(id);
        }
        return { success: true };
    }

    @Get('items/one/by-id/:id')
    async getItemById(@Param('id') id: number) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }

    @Get('items/many/by-distribution-id/:distributionId')
    async getItemsByDistributionId(@Param('distributionId') distributionId: number) {
        return await queryAllItems()
            .where('item.distributionId = :distributionId', { distributionId })
            .getMany();
    }
}

async function validateDistribution(distribution) {
    let errors = [];

    let distributionDbCode = await repo(DistributionEntity).createQueryBuilder('distribution').where("distribution.code = :code", { code: `${(<string>distribution.code)}` }).getOne();
    if (distributionDbCode && distributionDbCode.id != distribution.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(DistributionEntity)
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
    return repo(DistributionItemEntity)
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