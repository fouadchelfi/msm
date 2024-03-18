import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { SupplierEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('suppliers')
export class SuppliersController {

    @Get('all')
    async getAllSuppliers() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('supplier.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateSupplier(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.name))
            result = result.where("TRIM(LOWER(supplier.name)) LIKE :name", { name: `%${(<string>query.name).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('supplier.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('supplier.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('supplier.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('supplier.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`supplier.id`, query.order)
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
    async createSupplier(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateSupplier(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            name: body.name,
            debt: body.debt,
            address: body.address,
            postalCode: body.postalCode,
            province: body.province,
            city: body.city,
            phoneNumberOne: body.phoneNumberOne,
            phoneNumberTow: body.phoneNumberTow,
            fax: body.fax,
            email: body.email,
            website: body.website,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbSupplier = await repo(SupplierEntity).save(creation);

        if (isEmpty(dbSupplier.code)) await repo(SupplierEntity).update(dbSupplier.id, { ...creation, code: code('FOU', dbSupplier.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbSupplier.id)
        };
    }

    @Put('one/update/:id')
    async updateSupplier(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateSupplier(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(SupplierEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('FOU', id) : body.code,
            name: body.name,
            debt: body.debt,
            address: body.address,
            postalCode: body.postalCode,
            province: body.province,
            city: body.city,
            phoneNumberOne: body.phoneNumberOne,
            phoneNumberTow: body.phoneNumberTow,
            fax: body.fax,
            email: body.email,
            website: body.website,
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
        await repo(SupplierEntity).delete(ids);
        return { success: true };
    }
}

async function validateSupplier(supplier) {
    let errors = [];

    let supplierDbCode = await repo(SupplierEntity).createQueryBuilder('supplier').where("supplier.code = :code", { code: `${(<string>supplier.code)}` }).getOne();
    if (supplierDbCode && supplierDbCode.id != supplier.id)
        errors.push("Code existe déjà");

    let supplierDbName = await repo(SupplierEntity).createQueryBuilder('supplier').where("TRIM(LOWER(supplier.name)) = :name", { name: `${(<string>supplier.name).toLowerCase().trim()}` }).getOne();
    if (supplierDbName && supplierDbName.id != supplier.id)
        errors.push("Nom existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(SupplierEntity)
        .createQueryBuilder('supplier')
        .leftJoinAndSelect('supplier.createdBy', 'createdBy')
        .leftJoinAndSelect('supplier.lastUpdateBy', 'lastUpdateBy')
        .select([
            'supplier.id',
            'supplier.code',
            'supplier.name',
            'supplier.debt',
            'supplier.phoneNumberOne',
            'supplier.phoneNumberTow',
            'supplier.postalCode',
            'supplier.province',
            'supplier.city',
            'supplier.address',
            'supplier.fax',
            'supplier.email',
            'supplier.website',
            'supplier.notes',
            'supplier.createdAt',
            'supplier.lastUpdateAt',
            'createdBy',
            'lastUpdateBy'
        ]);
}