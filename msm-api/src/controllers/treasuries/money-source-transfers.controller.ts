import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { MoneySourceEntity, MoneySourceTransferEntity, StockEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('money-source-transfers')
export class MoneySourceTransfersController {

    @Get('all')
    async getAllTransfers() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneTransferById(@Param('id') id: number) {
        return await queryAll()
            .where('transfer.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateTransfer(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.fromMoneySourceId) && isNotEmpty(query.toMoneySourceId))
            result = result
                .where("transfer.fromMoneySourceId.id = :fromMoneySourceId", { fromMoneySourceId: `${query.fromMoneySourceId}` })
                .andWhere("transfer.toMoneySourceId.id = :toMoneySourceId", { toMoneySourceId: `${query.toMoneySourceId}` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('transfer.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('transfer.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('transfer.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('transfer.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`transfer.id`, query.order)
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
    async createTransfer(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateTransfer(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            fromMoneySourceId: body.fromMoneySourceId,
            toMoneySourceId: body.toMoneySourceId,
            amount: body.amount,
            oldFromMoneySourceAmount: body.oldFromMoneySourceAmount,
            newFromMoneySourceAmount: body.newFromMoneySourceAmount,
            oldToMoneySourceAmount: body.oldToMoneySourceAmount,
            newToMoneySourceAmount: body.newToMoneySourceAmount,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbTransfer = await repo(MoneySourceTransferEntity).save(creation);

        if (isEmpty(dbTransfer.code)) await repo(MoneySourceTransferEntity).update(dbTransfer.id, { ...creation, code: code('TRA', dbTransfer.id) });

        //Update amount for both Receiver and sender sources.
        await AppDataSource
            .createQueryBuilder()
            .update(MoneySourceEntity)
            .set({ amount: creation.newFromMoneySourceAmount })
            .where("id = :id", { id: creation.fromMoneySourceId })
            .execute();

        await AppDataSource
            .createQueryBuilder()
            .update(MoneySourceEntity)
            .set({ amount: creation.newToMoneySourceAmount })
            .where("id = :id", { id: creation.toMoneySourceId })
            .execute();

        return {
            success: true,
            errors: [],
            data: await this.getOneTransferById(dbTransfer.id)
        };
    }

    @Put('one/update/:id')
    async updateTransfer(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateTransfer(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(MoneySourceTransferEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('TRA', id) : body.code,
            fromMoneySourceId: body.fromMoneySourceId,
            toMoneySourceId: body.toMoneySourceId,
            amount: body.amount,
            oldFromMoneySourceAmount: body.oldFromMoneySourceAmount,
            newFromMoneySourceAmount: body.newFromMoneySourceAmount,
            oldToMoneySourceAmount: body.oldToMoneySourceAmount,
            newToMoneySourceAmount: body.newToMoneySourceAmount,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneTransferById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        await repo(MoneySourceTransferEntity).delete(ids);
        return { success: true };
    }
}

async function validateTransfer(transfer) {
    let errors = [];

    let transferDbCode = await repo(MoneySourceTransferEntity).createQueryBuilder('transfer').where("transfer.code = :code", { code: `${(<string>transfer.code)}` }).getOne();
    if (transferDbCode && transferDbCode.id != transfer.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(MoneySourceTransferEntity)
        .createQueryBuilder('transfer')
        .leftJoinAndSelect('transfer.createdBy', 'createdBy')
        .leftJoinAndSelect('transfer.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('transfer.fromMoneySourceId', 'fromMoneySourceId')
        .leftJoinAndSelect('transfer.toMoneySourceId', 'toMoneySourceId')
        .select(['transfer.id', 'transfer.code', 'transfer.amount', 'transfer.oldFromMoneySourceAmount', 'transfer.newFromMoneySourceAmount', 'transfer.oldToMoneySourceAmount', 'transfer.newToMoneySourceAmount', 'transfer.date', 'transfer.notes', 'transfer.createdAt', 'transfer.lastUpdateAt', 'fromMoneySourceId', 'toMoneySourceId', 'createdBy', 'lastUpdateBy']);
}