import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ChargeEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('charges')
export class ChargesController {

    @Get('all')
    async getAllCharges() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('charge.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateCharge(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(charge.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('charge.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('charge.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('charge.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('charge.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`charge.id`, query.order)
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
    async createCharge(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateCharge(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            label: body.label,
            chargeNatureId: body.chargeNatureId,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbCharge = await repo(ChargeEntity).save(creation);

        if (isEmpty(dbCharge.code)) await repo(ChargeEntity).update(dbCharge.id, { ...creation, code: code('CHR', dbCharge.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbCharge.id)
        };
    }

    @Put('one/update/:id')
    async updateCharge(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateCharge(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(ChargeEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('CHR', id) : body.code,
            label: body.label,
            chargeNatureId: body.chargeNatureId,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        await repo(ChargeEntity).delete(ids);
        return { success: true };
    }
}

async function validateCharge(charge) {
    let errors = [];

    let chargeDbCode = await repo(ChargeEntity).createQueryBuilder('charge').where("charge.code = :code", { code: `${(<string>charge.code)}` }).getOne();
    if (chargeDbCode && chargeDbCode.id != charge.id)
        errors.push("Code existe déjà");

    let chargeDbLabel = await repo(ChargeEntity).createQueryBuilder('charge').where("TRIM(LOWER(charge.label)) = :label", { label: `${(<string>charge.label).toLowerCase().trim()}` }).getOne();
    if (chargeDbLabel && chargeDbLabel.id != charge.id)
        errors.push("Libellé existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(ChargeEntity)
        .createQueryBuilder('charge')
        .leftJoinAndSelect('charge.createdBy', 'createdBy')
        .leftJoinAndSelect('charge.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('charge.chargeNatureId', 'chargeNatureId')
        .select(['charge.id', 'charge.code', 'charge.label', 'charge.notes', 'chargeNatureId', 'charge.amount', 'charge.date', 'charge.createdAt', 'charge.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}