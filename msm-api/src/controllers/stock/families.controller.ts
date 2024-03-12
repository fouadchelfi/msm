import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { FamilyEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('families')
export class FamiliesController {

    @Get('all')
    async getAllFamilies() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('family.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateFamily(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(family.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('family.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('family.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('family.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('family.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`family.id`, query.order)
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
    async createFamily(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateFamily(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            label: body.label,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbFamily = await repo(FamilyEntity).save(creation);

        if (isEmpty(dbFamily.code)) await repo(FamilyEntity).update(dbFamily.id, { ...creation, code: code('FML', dbFamily.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbFamily.id)
        };
    }

    @Put('one/update/:id')
    async updateFamily(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateFamily(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(FamilyEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('FML', id) : body.code,
            label: body.label,
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
        await repo(FamilyEntity).delete(ids);
        return { success: true };
    }
}

async function validateFamily(family) {
    let errors = [];

    let familyDbCode = await repo(FamilyEntity).createQueryBuilder('family').where("family.code = :code", { code: `${(<string>family.code)}` }).getOne();
    if (familyDbCode && familyDbCode.id != family.id)
        errors.push("Code existe déjà");

    let familyDbLabel = await repo(FamilyEntity).createQueryBuilder('family').where("TRIM(LOWER(family.label)) = :label", { label: `${(<string>family.label).toLowerCase().trim()}` }).getOne();
    if (familyDbLabel && familyDbLabel.id != family.id)
        errors.push("Libellé existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(FamilyEntity)
        .createQueryBuilder('family')
        .leftJoinAndSelect('family.createdBy', 'createdBy')
        .leftJoinAndSelect('family.lastUpdateBy', 'lastUpdateBy')
        .select(['family.id', 'family.code', 'family.label', 'family.notes', 'family.createdAt', 'family.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}