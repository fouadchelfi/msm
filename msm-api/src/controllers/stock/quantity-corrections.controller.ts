import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { QuantityCorrectionEntity, StockEntity } from 'src/entities';
import { ManagerService } from 'src/services';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('quantity-corrections')
export class QuantityCorrectionsController {

    constructor(private manager: ManagerService) { }

    @Get('all')
    async getAllQuantityCorrections() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneQuantityCorrectionById(@Param('id') id: number) {
        return await queryAll()
            .where('quantitycorrection.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateQuantityCorrection(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.stockId))
            result = result.where("quantitycorrection.stockId = :stockId", { stockId: `${query.stockId}` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('quantitycorrection.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('quantitycorrection.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('quantitycorrection.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('quantitycorrection.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`quantitycorrection.id`, query.order)
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
    async createQuantityCorrection(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateQuantityCorrection(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            stockId: body.stockId,
            oldQuantity: body.oldQuantity,
            newQuantity: body.newQuantity,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };

        let dbQuantityCorrection = await repo(QuantityCorrectionEntity).save(creation);

        if (isEmpty(dbQuantityCorrection.code)) await repo(QuantityCorrectionEntity).update(dbQuantityCorrection.id, { ...creation, code: code('QTC', dbQuantityCorrection.id) });

        //Sync database changes
        await this.manager.updateStockQuantity(creation.stockId, creation.newQuantity, 'replace');

        return {
            success: true,
            errors: [],
            data: await this.getOneQuantityCorrectionById(dbQuantityCorrection.id)
        };
    }

    @Put('one/update/:id')
    async updateQuantityCorrection(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateQuantityCorrection(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(QuantityCorrectionEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('QTC', id) : body.code,
            stockId: body.stockId,
            oldQuantity: body.oldQuantity,
            newQuantity: body.newQuantity,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneQuantityCorrectionById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        await repo(QuantityCorrectionEntity).delete(ids);
        return { success: true };
    }
}

async function validateQuantityCorrection(quantitycorrection) {
    let errors = [];

    let quantitycorrectionDbCode = await repo(QuantityCorrectionEntity).createQueryBuilder('quantitycorrection').where("quantitycorrection.code = :code", { code: `${(<string>quantitycorrection.code)}` }).getOne();
    if (quantitycorrectionDbCode && quantitycorrectionDbCode.id != quantitycorrection.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(QuantityCorrectionEntity)
        .createQueryBuilder('quantitycorrection')
        .leftJoinAndSelect('quantitycorrection.createdBy', 'createdBy')
        .leftJoinAndSelect('quantitycorrection.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('quantitycorrection.stockId', 'stockId')
        .select(['quantitycorrection.id', 'quantitycorrection.code', 'quantitycorrection.oldQuantity', 'quantitycorrection.newQuantity', 'quantitycorrection.date', 'quantitycorrection.notes', 'quantitycorrection.createdAt', 'quantitycorrection.lastUpdateAt', 'stockId', 'createdBy', 'lastUpdateBy']);
}