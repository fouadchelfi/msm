import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PremiseReturnEntity, PremiseReturnItemEntity } from 'src/entities';
import { ManagerService } from 'src/services';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('premise-returns')
export class PremiseReturnsController {

    constructor(private manager: ManagerService) { }

    @Get('all')
    async getAllPremiseReturns() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOnePremiseReturnById(@Param('id') id: number) {
        return await queryAll()
            .where('premiseReturn.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginatePremiseReturn(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.moneySourceId))
            result = result.where("premiseReturn.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });

        if (isNotEmpty(query.premiseId))
            result = result.andWhere("premiseReturn.premiseId = :premiseId", { premiseId: query.premiseId });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.andWhere('DATE(premiseReturn.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(premiseReturn.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.andWhere('DATE(premiseReturn.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(premiseReturn.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`premiseReturn.id`, query.order)
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
    async createPremiseReturn(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validatePremiseReturn(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            returnedCash: body.returnedCash,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            premiseId: body.premiseId,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbPremiseReturn = await repo(PremiseReturnEntity).save(creation);

        if (isEmpty(dbPremiseReturn.code)) await repo(PremiseReturnEntity).update(dbPremiseReturn.id, { ...creation, code: code('RTL', dbPremiseReturn.id) });

        //Asigne premiseReturn id to every item.
        (<any[]>body.items).map(item => item.premiseReturnId = parseInt(dbPremiseReturn.id));
        //Save items
        await repo(PremiseReturnItemEntity).save(body.items);

        //Sync database changes
        for (const item of (<any[]>body.items)) {
            await this.manager.updateStockQuantity(item.stockId, item.quantity, 'add');
        }
        this.manager.updatePremiseDebt(creation.premiseId, -(parseFloat(creation.returnedCash) + parseFloat(creation.totalAmount)), 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, creation.returnedCash, 'add');

        return {
            success: true,
            errors: [],
            data: await this.getOnePremiseReturnById(dbPremiseReturn.id)
        };
    }

    @Put('one/update/:id')
    async updatePremiseReturn(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validatePremiseReturn(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(PremiseReturnEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('RTL', id) : body.code,
            //...
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        });

        return {
            success: true,
            errors: [],
            data: await this.getOnePremiseReturnById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        for (const id of ids) {
            let itemsIds = (<any[]>(await this.getItemsByPremiseReturnId(id))).map(item => (<number>item.id));
            if (itemsIds.length > 0) await repo(PremiseReturnItemEntity).delete(itemsIds);
            await repo(PremiseReturnEntity).delete(id);
        }
        return { success: true };
    }

    @Get('items/one/by-id/:id')
    async getItemById(@Param('id') id: number) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }

    @Get('items/many/by-premise-return-id/:premiseReturnId')
    async getItemsByPremiseReturnId(@Param('premiseReturnId') premiseReturnId: number) {
        return await queryAllItems()
            .where('item.premiseReturnId = :premiseReturnId', { premiseReturnId })
            .getMany();
    }
}

async function validatePremiseReturn(premiseReturn) {
    let errors = [];

    let premiseReturnDbCode = await repo(PremiseReturnEntity).createQueryBuilder('premiseReturn').where("premiseReturn.code = :code", { code: `${(<string>premiseReturn.code)}` }).getOne();
    if (premiseReturnDbCode && premiseReturnDbCode.id != premiseReturn.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(PremiseReturnEntity)
        .createQueryBuilder('premiseReturn')
        .leftJoinAndSelect('premiseReturn.moneySourceId', 'moneySourceId')
        .leftJoinAndSelect('premiseReturn.premiseId', 'premiseId')
        .leftJoinAndSelect('premiseReturn.createdBy', 'createdBy')
        .leftJoinAndSelect('premiseReturn.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('premiseReturn.items', 'items')
        .leftJoinAndSelect('items.stockId', 'itemsStockId')
        .select([
            'premiseReturn.id',
            'premiseReturn.code',
            'premiseReturn.returnedCash',
            'premiseReturn.totalQuantity',
            'premiseReturn.totalAmount',
            'premiseReturn.date',
            'premiseReturn.notes',
            'premiseReturn.createdAt',
            'premiseReturn.lastUpdateAt',
            'moneySourceId',
            'premiseId',
            'createdBy',
            'lastUpdateBy',
            'items',
            'itemsStockId'
        ]).orderBy('items.id', 'ASC');
}

function queryAllItems() {
    return repo(PremiseReturnItemEntity)
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.stockId', 'stockId')
        .leftJoinAndSelect('item.premiseReturnId', 'premiseReturnId')
        .select([
            'item.id',
            'item.quantity',
            'item.salePrice',
            'item.amount',
            'stockId',
            'premiseReturnId'
        ]);
}