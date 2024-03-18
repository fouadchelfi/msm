import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PurchaseEntity, PurchaseItemEntity } from 'src/entities';
import { ManagerService } from 'src/services';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('purchases')
export class PurchasesController {

    constructor(private manager: ManagerService) { }

    @Get('all')
    async getAllPurchases() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOnePurchaseById(@Param('id') id: number) {
        return await queryAll()
            .where('purchase.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginatePurchase(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.moneySourceId))
            result = result.where("purchase.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });

        if (isNotEmpty(query.supplierId))
            result = result.andWhere("purchase.supplierId = :supplierId", { supplierId: query.supplierId });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('purchase.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('purchase.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('purchase.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('purchase.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`purchase.id`, query.order)
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
    async createPurchase(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validatePurchase(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            cost: body.cost,
            payment: body.payment,
            totalQuantity: body.totalQuantity,
            totalAmount: body.totalAmount,
            moneySourceId: body.moneySourceId,
            supplierId: body.supplierId,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbPurchase = await repo(PurchaseEntity).save(creation);

        if (isEmpty(dbPurchase.code)) await repo(PurchaseEntity).update(dbPurchase.id, { ...creation, code: code('ACH', dbPurchase.id) });

        //Asigne purchase id to every item.
        (<any[]>body.items).map(item => item.purchaseId = parseInt(dbPurchase.id));
        //Save items
        await repo(PurchaseItemEntity).save(body.items);

        //Sync database changes
        for (const item of (<any[]>body.items)) {
            await this.manager.updateStockQuantity(item.stockId, item.quantity, 'add');
        }
        this.manager.updateSupplierDebt(creation.supplierId, parseFloat(creation.cost) - parseFloat(creation.payment), 'add');
        this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.payment, 'add');

        return {
            success: true,
            errors: [],
            data: await this.getOnePurchaseById(dbPurchase.id)
        };
    }

    @Put('one/update/:id')
    async updatePurchase(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validatePurchase(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(PurchaseEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('ACH', id) : body.code,
            //...
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        });

        return {
            success: true,
            errors: [],
            data: await this.getOnePurchaseById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        for (const id of ids) {
            let itemsIds = (<any[]>(await this.getItemsByPurchaseId(id))).map(item => (<number>item.id));
            if (itemsIds.length > 0) await repo(PurchaseItemEntity).delete(itemsIds);
            await repo(PurchaseEntity).delete(id);
        }
        return { success: true };
    }

    @Get('items/one/by-id/:id')
    async getItemById(@Param('id') id: number) {
        return await queryAllItems()
            .where('item.id = :id', { id })
            .getOne();
    }

    @Get('items/many/by-purchase-id/:purchaseId')
    async getItemsByPurchaseId(@Param('purchaseId') purchaseId: number) {
        return await queryAllItems()
            .where('item.purchaseId = :purchaseId', { purchaseId })
            .getMany();
    }
}

async function validatePurchase(purchase) {
    let errors = [];

    let purchaseDbCode = await repo(PurchaseEntity).createQueryBuilder('purchase').where("purchase.code = :code", { code: `${(<string>purchase.code)}` }).getOne();
    if (purchaseDbCode && purchaseDbCode.id != purchase.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(PurchaseEntity)
        .createQueryBuilder('purchase')
        .leftJoinAndSelect('purchase.moneySourceId', 'moneySourceId')
        .leftJoinAndSelect('purchase.supplierId', 'supplierId')
        .leftJoinAndSelect('purchase.createdBy', 'createdBy')
        .leftJoinAndSelect('purchase.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('purchase.items', 'items')
        .leftJoinAndSelect('items.stockId', 'itemsStockId')
        .select([
            'purchase.id',
            'purchase.code',
            'purchase.cost',
            'purchase.payment',
            'purchase.totalQuantity',
            'purchase.totalAmount',
            'purchase.date',
            'purchase.notes',
            'purchase.createdAt',
            'purchase.lastUpdateAt',
            'moneySourceId',
            'supplierId',
            'createdBy',
            'lastUpdateBy',
            'items',
            'itemsStockId'
        ]).orderBy('items.id', 'ASC');
}

function queryAllItems() {
    return repo(PurchaseItemEntity)
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.stockId', 'stockId')
        .leftJoinAndSelect('item.purchaseId', 'purchaseId')
        .select([
            'item.id',
            'item.quantity',
            'item.salePrice',
            'item.amount',
            'stockId',
            'purchaseId'
        ]);
}