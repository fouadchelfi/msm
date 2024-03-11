import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LosseEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('losses')
export class LossesController {

    @Get('all')
    async getAllLosses() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('losse.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateLosse(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(losse.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('losse.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('losse.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('losse.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('losse.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`losse.id`, query.order)
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
    async createLosse(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateLosse(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            label: body.label,
            losseNatureId: body.losseNatureId,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbLosse = await repo(LosseEntity).save(creation);

        if (isEmpty(dbLosse.code)) await repo(LosseEntity).update(dbLosse.id, { ...creation, code: code('CHR', dbLosse.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbLosse.id)
        };
    }

    @Put('one/update/:id')
    async updateLosse(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateLosse(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(LosseEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('CHR', id) : body.code,
            label: body.label,
            losseNatureId: body.losseNatureId,
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
        await repo(LosseEntity).delete(ids);
        return { success: true };
    }
}

async function validateLosse(losse) {
    let errors = [];

    let losseDbCode = await repo(LosseEntity).createQueryBuilder('losse').where("losse.code = :code", { code: `${(<string>losse.code)}` }).getOne();
    if (losseDbCode && losseDbCode.id != losse.id)
        errors.push("Code existe déjà");

    let losseDbLabel = await repo(LosseEntity).createQueryBuilder('losse').where("TRIM(LOWER(losse.label)) = :label", { label: `${(<string>losse.label).toLowerCase().trim()}` }).getOne();
    if (losseDbLabel && losseDbLabel.id != losse.id)
        errors.push("Libellé existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(LosseEntity)
        .createQueryBuilder('losse')
        .leftJoinAndSelect('losse.createdBy', 'createdBy')
        .leftJoinAndSelect('losse.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('losse.losseNatureId', 'losseNatureId')
        .select(['losse.id', 'losse.code', 'losse.label', 'losse.notes', 'losseNatureId', 'losse.amount', 'losse.date', 'losse.createdAt', 'losse.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}