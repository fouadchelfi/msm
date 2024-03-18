import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { StatusTransferEntity, StockEntity } from 'src/entities';
import { ManagerService } from 'src/services';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('status-transfers')
export class StatusTransfersController {

    constructor(private manager: ManagerService) { }

    @Get('all')
    async getAllStatusTransfers() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneStatusTransferById(@Param('id') id: number) {
        return await queryAll()
            .where('statustransfer.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateStatusTransfer(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.freeStockId))
            result = result.where("statustransfer.freeStockId.id = :freeStockId", { freeStockId: `${query.freeStockId}` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.andWhere('DATE(statustransfer.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(statustransfer.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.andWhere('DATE(statustransfer.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(statustransfer.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`statustransfer.id`, query.order)
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
    async createStatusTransfer(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateStatusTransfer(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            freeStockId: body.freeStockId,
            frozenStockId: body.frozenStockId,
            transferedQuantity: body.transferedQuantity,
            oldFreeQuantity: body.oldFreeQuantity,
            newFreeQuantity: body.newFreeQuantity,
            oldFrozenQuantity: body.oldFrozenQuantity,
            newFrozenQuantity: body.newFrozenQuantity,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbStatusTransfer = await repo(StatusTransferEntity).save(creation);

        if (isEmpty(dbStatusTransfer.code)) await repo(StatusTransferEntity).update(dbStatusTransfer.id, { ...creation, code: code('STT', dbStatusTransfer.id) });

        //Sync database changes
        await this.manager.updateStockQuantity(creation.freeStockId, creation.newFreeQuantity, 'replace');
        await this.manager.updateStockQuantity(creation.frozenStockId, creation.newFrozenQuantity, 'replace');

        return {
            success: true,
            errors: [],
            data: await this.getOneStatusTransferById(dbStatusTransfer.id)
        };
    }

    @Put('one/update/:id')
    async updateStatusTransfer(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateStatusTransfer(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(StatusTransferEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('STT', id) : body.code,
            freeStockId: body.freeStockId,
            frozenStockId: body.frozenStockId,
            transferedQuantity: body.transferedQuantity,
            oldFreeQuantity: body.oldFreeQuantity,
            newFreeQuantity: body.newFreeQuantity,
            oldFrozenQuantity: body.oldFrozenQuantity,
            newFrozenQuantity: body.newFrozenQuantity,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneStatusTransferById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        await repo(StatusTransferEntity).delete(ids);
        return { success: true };
    }
}

async function validateStatusTransfer(statustransfer) {
    let errors = [];

    let statustransferDbCode = await repo(StatusTransferEntity).createQueryBuilder('statustransfer').where("statustransfer.code = :code", { code: `${(<string>statustransfer.code)}` }).getOne();
    if (statustransferDbCode && statustransferDbCode.id != statustransfer.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(StatusTransferEntity)
        .createQueryBuilder('statustransfer')
        .leftJoinAndSelect('statustransfer.createdBy', 'createdBy')
        .leftJoinAndSelect('statustransfer.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('statustransfer.freeStockId', 'freeStockId')
        .leftJoinAndSelect('statustransfer.frozenStockId', 'frozenStockId')
        .select(['statustransfer.id', 'statustransfer.code', 'statustransfer.transferedQuantity', 'statustransfer.oldFreeQuantity', 'statustransfer.newFreeQuantity', 'statustransfer.oldFrozenQuantity', 'statustransfer.newFrozenQuantity', 'statustransfer.date', 'statustransfer.notes', 'statustransfer.createdAt', 'statustransfer.lastUpdateAt', 'freeStockId', 'frozenStockId', 'createdBy', 'lastUpdateBy']);
}