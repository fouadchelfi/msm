import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { PremiseEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('premises')
export class PremisesController {

    @Get('all')
    async getAllPremises() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('premise.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginatePremise(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(premise.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('premise.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('premise.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('premise.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('premise.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`premise.id`, query.order)
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
    async createPremise(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validatePremise(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            label: body.label,
            debt: body.debt,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbPremise = await repo(PremiseEntity).save(creation);

        if (isEmpty(dbPremise.code)) await repo(PremiseEntity).update(dbPremise.id, { ...creation, code: code('LCL', dbPremise.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbPremise.id)
        };
    }

    @Put('one/update/:id')
    async updatePremise(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validatePremise(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(PremiseEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('LCL', id) : body.code,
            label: body.label,
            debt: body.debt,
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
        await repo(PremiseEntity).delete(ids);
        return { success: true };
    }
}

async function validatePremise(premise) {
    let errors = [];

    let premiseDbCode = await repo(PremiseEntity).createQueryBuilder('premise').where("premise.code = :code", { code: `${(<string>premise.code)}` }).getOne();
    if (premiseDbCode && premiseDbCode.id != premise.id)
        errors.push("Code existe déjà");

    let premiseDbLabel = await repo(PremiseEntity).createQueryBuilder('premise').where("TRIM(LOWER(premise.label)) = :label", { label: `${(<string>premise.label).toLowerCase().trim()}` }).getOne();
    if (premiseDbLabel && premiseDbLabel.id != premise.id)
        errors.push("Libellé existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(PremiseEntity)
        .createQueryBuilder('premise')
        .leftJoinAndSelect('premise.createdBy', 'createdBy')
        .leftJoinAndSelect('premise.lastUpdateBy', 'lastUpdateBy')
        .select(['premise.id', 'premise.code', 'premise.label', 'premise.debt', 'premise.notes', 'premise.createdAt', 'premise.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}