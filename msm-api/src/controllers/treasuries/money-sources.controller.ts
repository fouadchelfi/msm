import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { MoneySourceEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('money-sources')
export class MoneySourcesController {

    @Get('all')
    async getAllSources() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('source.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateSource(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(source.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('source.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('source.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('source.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('source.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`source.id`, query.order)
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
    async createSource(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateSource(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            label: body.label,
            nature: body.nature,
            amount: body.amount,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbSource = await repo(MoneySourceEntity).save(creation);

        if (isEmpty(dbSource.code)) await repo(MoneySourceEntity).update(dbSource.id, { ...creation, code: code('SRA', dbSource.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbSource.id)
        };
    }

    @Put('one/update/:id')
    async updateSource(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateSource(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(MoneySourceEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('SRA', id) : body.code,
            label: body.label,
            nature: body.nature,
            amount: body.amount,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
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
        await repo(MoneySourceEntity).delete(ids);
        return { success: true };
    }
}

async function validateSource(source) {
    let errors = [];

    let sourceDbCode = await repo(MoneySourceEntity).createQueryBuilder('source').where("source.code = :code", { code: `${(<string>source.code)}` }).getOne();
    if (sourceDbCode && sourceDbCode.id != source.id)
        errors.push("Code existe déjà");

    let sourceDbLabel = await repo(MoneySourceEntity).createQueryBuilder('source').where("TRIM(LOWER(source.label)) = :label", { label: `${(<string>source.label).toLowerCase().trim()}` }).getOne();
    if (sourceDbLabel && sourceDbLabel.id != source.id)
        errors.push("Libellé existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(MoneySourceEntity)
        .createQueryBuilder('source')
        .leftJoinAndSelect('source.createdBy', 'createdBy')
        .leftJoinAndSelect('source.lastUpdateBy', 'lastUpdateBy')
        .select(['source.id', 'source.code', 'source.label', 'source.nature', 'source.amount', 'source.notes', 'source.createdAt', 'source.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}