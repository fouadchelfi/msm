import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CustomerEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('customers')
export class CustomersController {

    @Get('all')
    async getAllCustomers() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('customer.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateCustomer(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.name))
            result = result.where("TRIM(LOWER(customer.name)) LIKE :name", { name: `%${(<string>query.name).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('customer.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('customer.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('customer.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('customer.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`customer.id`, query.order)
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
    async createCustomer(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateCustomer(body);
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
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbCustomer = await repo(CustomerEntity).save(creation);

        if (isEmpty(dbCustomer.code)) await repo(CustomerEntity).update(dbCustomer.id, { ...creation, code: code('CLT', dbCustomer.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbCustomer.id)
        };
    }

    @Put('one/update/:id')
    async updateCustomer(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateCustomer(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(CustomerEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('CLT', id) : body.code,
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
        await repo(CustomerEntity).delete(ids);
        return { success: true };
    }
}

async function validateCustomer(customer) {
    let errors = [];

    let customerDbCode = await repo(CustomerEntity).createQueryBuilder('customer').where("customer.code = :code", { code: `${(<string>customer.code)}` }).getOne();
    if (customerDbCode && customerDbCode.id != customer.id)
        errors.push("Code existe déjà");

    let customerDbName = await repo(CustomerEntity).createQueryBuilder('customer').where("TRIM(LOWER(customer.name)) = :name", { name: `${(<string>customer.name).toLowerCase().trim()}` }).getOne();
    if (customerDbName && customerDbName.id != customer.id)
        errors.push("Nom existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(CustomerEntity)
        .createQueryBuilder('customer')
        .leftJoinAndSelect('customer.createdBy', 'createdBy')
        .leftJoinAndSelect('customer.lastUpdateBy', 'lastUpdateBy')
        .select([
            'customer.id',
            'customer.code',
            'customer.name',
            'customer.debt',
            'customer.phoneNumberOne',
            'customer.phoneNumberTow',
            'customer.postalCode',
            'customer.province',
            'customer.city',
            'customer.address',
            'customer.fax',
            'customer.email',
            'customer.website',
            'customer.notes',
            'customer.createdAt',
            'customer.lastUpdateAt',
            'createdBy',
            'lastUpdateBy'
        ]);
}