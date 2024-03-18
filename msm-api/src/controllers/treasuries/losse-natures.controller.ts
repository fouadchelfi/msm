import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { LosseNatureEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('losse-natures')
export class LosseNaturesController {

    @Get('all')
    async getAllLosseNatures() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('losseNature.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateLosseNature(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(losseNature.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('losseNature.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('losseNature.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('losseNature.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('losseNature.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`losseNature.id`, query.order)
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
    async createLosseNature(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateLosseNature(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            label: body.label,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbLosseNature = await repo(LosseNatureEntity).save(creation);

        if (isEmpty(dbLosseNature.code)) await repo(LosseNatureEntity).update(dbLosseNature.id, { ...creation, code: code('NPR', dbLosseNature.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbLosseNature.id)
        };
    }

    @Put('one/update/:id')
    async updateLosseNature(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateLosseNature(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(LosseNatureEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('NPR', id) : body.code,
            label: body.label,
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
        await repo(LosseNatureEntity).delete(ids);
        return { success: true };
    }
}

async function validateLosseNature(losseNature) {
    let errors = [];

    let lossenatureDbCode = await repo(LosseNatureEntity).createQueryBuilder('losseNature').where("losseNature.code = :code", { code: `${(<string>losseNature.code)}` }).getOne();
    if (lossenatureDbCode && lossenatureDbCode.id != losseNature.id)
        errors.push("Code existe déjà");

    let lossenatureDbLabel = await repo(LosseNatureEntity).createQueryBuilder('losseNature').where("TRIM(LOWER(losseNature.label)) = :label", { label: `${(<string>losseNature.label).toLowerCase().trim()}` }).getOne();
    if (lossenatureDbLabel && lossenatureDbLabel.id != losseNature.id)
        errors.push("Libellé existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(LosseNatureEntity)
        .createQueryBuilder('losseNature')
        .leftJoinAndSelect('losseNature.createdBy', 'createdBy')
        .leftJoinAndSelect('losseNature.lastUpdateBy', 'lastUpdateBy')
        .select(['losseNature.id', 'losseNature.code', 'losseNature.label', 'losseNature.notes', 'losseNature.createdAt', 'losseNature.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}