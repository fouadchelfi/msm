import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CategoryEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('categories')
export class CategoriesController {

    @Get('all')
    async getAllCategories() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('category.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateCategory(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.label))
            result = result.where("TRIM(LOWER(category.label)) LIKE :label", { label: `%${(<string>query.label).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('category.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('category.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('category.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('category.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`category.id`, query.order)
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
    async createCategory(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateCategory(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            label: body.label,
            code: body.code,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbCategory = await repo(CategoryEntity).save(creation);

        if (isEmpty(dbCategory.code)) await repo(CategoryEntity).update(dbCategory.id, { ...creation, code: code('CAT', dbCategory.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbCategory.id)
        };
    }

    @Put('one/update/:id')
    async updateCategory(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateCategory(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(CategoryEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('CAT', id) : body.code,
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
        await repo(CategoryEntity).delete(ids);
        return { success: true };
    }
}

async function validateCategory(category) {
    let errors = [];

    let categoryDb = await repo(CategoryEntity).createQueryBuilder('category').where("TRIM(LOWER(category.label)) LIKE :label", { label: `%${(<string>category.label).toLowerCase().trim()}%` }).getOne();
    if (categoryDb && categoryDb.id != category.id)
        errors.push("Libellé existe déjà");

    if (isNotEmpty(category.code) && await (repo(CategoryEntity).createQueryBuilder('categories').where("TRIM(categories.code) = TRIM(:code)", { code: category.code })).getExists())
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(CategoryEntity)
        .createQueryBuilder('category')
        .leftJoinAndSelect('category.createdBy', 'createdBy')
        .leftJoinAndSelect('category.lastUpdateBy', 'lastUpdateBy')
        .select(['category.id', 'category.label', 'category.code', 'category.notes', 'category.createdAt', 'category.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}