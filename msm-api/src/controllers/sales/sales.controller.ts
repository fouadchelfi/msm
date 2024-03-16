import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SaleEntity, SaleItemEntity } from 'src/entities';
import { ManagerService } from 'src/services';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('sales')
export class SalesController {

    constructor(private manager: ManagerService) { }

    @Get('all')
    async getAllSales() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneSaleById(@Param('id') id: number) {
        return await queryAll()
            .where('sale.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateSale(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.moneySourceId))
            result = result.where("sale.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });

        if (isNotEmpty(query.customerId))
            result = result.andWhere("sale.customerId = :customerId", { customerId: query.customerId });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('sale.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('sale.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('sale.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('sale.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`sale.id`, query.order)
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
    async createSale(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateSale(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            deliveryAmount: body.deliveryAmount,
            payment: body.payment,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            customerId: body.customerId,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbSale = await repo(SaleEntity).save(creation);

        if (isEmpty(dbSale.code)) await repo(SaleEntity).update(dbSale.id, { ...creation, code: code('VNT', dbSale.id) });

        //Asigne sale id to every item.
        (<any[]>body.items).map(item => item.saleId = parseInt(dbSale.id));
        //Save items
        await repo(SaleItemEntity).save(body.items);

        //Sync database changes
        for (const item of (<any[]>body.items)) {
            await this.manager.updateStockQuantity(item.stockId, item.quantity, 'add');
        }
        // this.manager.updateCustomerDebt(creation.customerId, parseFloat(creation.cost) - parseFloat(creation.payment), 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.payment, 'add');

        return {
            success: true,
            errors: [],
            data: await this.getOneSaleById(dbSale.id)
        };
    }

    @Put('one/update/:id')
    async updateSale(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateSale(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(SaleEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('VNT', id) : body.code,
            //...
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneSaleById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        for (const id of ids) {
            let itemsIds = (<any[]>(await this.getItemsBySaleId(id))).map(item => (<number>item.id));
            if (itemsIds.length > 0) await repo(SaleItemEntity).delete(itemsIds);
            await repo(SaleEntity).delete(id);
        }
        return { success: true };
    }

    @Get('items/one/by-id/:id')
    async getItemById(@Param('id') id: number) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }

    @Get('items/many/by-sale-id/:saleId')
    async getItemsBySaleId(@Param('saleId') saleId: number) {
        return await queryAllItems()
            .where('item.saleId = :saleId', { saleId })
            .getMany();
    }
}

async function validateSale(sale) {
    let errors = [];

    let saleDbCode = await repo(SaleEntity).createQueryBuilder('sale').where("sale.code = :code", { code: `${(<string>sale.code)}` }).getOne();
    if (saleDbCode && saleDbCode.id != sale.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(SaleEntity)
        .createQueryBuilder('sale')
        .leftJoinAndSelect('sale.moneySourceId', 'moneySourceId')
        .leftJoinAndSelect('sale.customerId', 'customerId')
        .leftJoinAndSelect('sale.createdBy', 'createdBy')
        .leftJoinAndSelect('sale.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('sale.items', 'items')
        .leftJoinAndSelect('items.stockId', 'itemsStockId')
        .select([
            'sale.id',
            'sale.code',
            'sale.deliveryAmount',
            'sale.payment',
            'sale.totalQuantity',
            'sale.totalAmount',
            'sale.date',
            'sale.notes',
            'sale.createdAt',
            'sale.lastUpdateAt',
            'moneySourceId',
            'customerId',
            'createdBy',
            'lastUpdateBy',
            'items',
            'itemsStockId'
        ]).orderBy('items.id', 'ASC');
}

function queryAllItems() {
    return repo(SaleItemEntity)
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.stockId', 'stockId')
        .leftJoinAndSelect('item.saleId', 'saleId')
        .select([
            'item.id',
            'item.quantity',
            'item.salePrice',
            'item.amount',
            'stockId',
            'saleId'
        ]);
}