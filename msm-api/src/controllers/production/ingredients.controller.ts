import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { IngredientEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('ingredients')
export class IngredientsController {

    @Get('all')
    async getAllIngredients() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('ingredient.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateIngredient(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(ingredient.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('ingredient.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('ingredient.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('ingredient.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('ingredient.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`ingredient.id`, query.order)
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
    async createIngredient(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateIngredient(body);
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
        let dbIngredient = await repo(IngredientEntity).save(creation);

        if (isEmpty(dbIngredient.code)) await repo(IngredientEntity).update(dbIngredient.id, { ...creation, code: code('ING', dbIngredient.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbIngredient.id)
        };
    }

    @Put('one/update/:id')
    async updateIngredient(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateIngredient(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(IngredientEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('ING', id) : body.code,
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
        await repo(IngredientEntity).delete(ids);
        return { success: true };
    }
}

async function validateIngredient(ingredient) {
    let errors = [];

    let ingredientDbCode = await repo(IngredientEntity).createQueryBuilder('ingredient').where("ingredient.code = :code", { code: `${(<string>ingredient.code)}` }).getOne();
    if (ingredientDbCode && ingredientDbCode.id != ingredient.id)
        errors.push("Code existe déjà");

    let ingredientDbLabel = await repo(IngredientEntity).createQueryBuilder('ingredient').where("TRIM(LOWER(ingredient.label)) = :label", { label: `${(<string>ingredient.label).toLowerCase().trim()}` }).getOne();
    if (ingredientDbLabel && ingredientDbLabel.id != ingredient.id)
        errors.push("Libellé existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(IngredientEntity)
        .createQueryBuilder('ingredient')
        .leftJoinAndSelect('ingredient.createdBy', 'createdBy')
        .leftJoinAndSelect('ingredient.lastUpdateBy', 'lastUpdateBy')
        .select(['ingredient.id', 'ingredient.code', 'ingredient.label', 'ingredient.notes', 'ingredient.createdAt', 'ingredient.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}