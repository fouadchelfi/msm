import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ChargeNatureEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('charge-natures')
export class ChargeNaturesController {

    @Get('all')
    async getAllChargeNatures() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('chargeNature.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateChargeNature(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(chargeNature.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.andWhere('DATE(chargeNature.createdAt) >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('DATE(chargeNature.createdAt) <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.andWhere('DATE(chargeNature.lastUpdateAt) >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('DATE(chargeNature.lastUpdateAt) <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`chargeNature.id`, query.order)
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
    async createChargeNature(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateChargeNature(body);
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
        let dbChargeNature = await repo(ChargeNatureEntity).save(creation);

        if (isEmpty(dbChargeNature.code)) await repo(ChargeNatureEntity).update(dbChargeNature.id, { ...creation, code: code('NCH', dbChargeNature.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbChargeNature.id)
        };
    }

    @Put('one/update/:id')
    async updateChargeNature(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateChargeNature(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(ChargeNatureEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('NCH', id) : body.code,
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
        await repo(ChargeNatureEntity).delete(ids);
        return { success: true };
    }
}

async function validateChargeNature(chargeNature) {
    let errors = [];

    let chargenatureDbCode = await repo(ChargeNatureEntity).createQueryBuilder('chargeNature').where("chargeNature.code = :code", { code: `${(<string>chargeNature.code)}` }).getOne();
    if (chargenatureDbCode && chargenatureDbCode.id != chargeNature.id)
        errors.push("Code existe déjà");

    let chargenatureDbLabel = await repo(ChargeNatureEntity).createQueryBuilder('chargeNature').where("TRIM(LOWER(chargeNature.label)) = :label", { label: `${(<string>chargeNature.label).toLowerCase().trim()}` }).getOne();
    if (chargenatureDbLabel && chargenatureDbLabel.id != chargeNature.id)
        errors.push("Libellé existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(ChargeNatureEntity)
        .createQueryBuilder('chargeNature')
        .leftJoinAndSelect('chargeNature.createdBy', 'createdBy')
        .leftJoinAndSelect('chargeNature.lastUpdateBy', 'lastUpdateBy')
        .select(['chargeNature.id', 'chargeNature.code', 'chargeNature.label', 'chargeNature.notes', 'chargeNature.createdAt', 'chargeNature.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}