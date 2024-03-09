import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { EmployeeEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('employees')
export class EmployeesController {

    @Get('all')
    async getAllEmployees() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('employee.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateEmployee(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.name))
            result = result.where("TRIM(LOWER(employee.name)) LIKE :name", { name: `%${(<string>query.name).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('employee.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('employee.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('employee.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('employee.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`employee.id`, query.order)
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
    async createEmployee(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateEmployee(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            name: body.name,
            salary: body.salary,
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
        let dbEmployee = await repo(EmployeeEntity).save(creation);

        if (isEmpty(dbEmployee.code)) await repo(EmployeeEntity).update(dbEmployee.id, { ...creation, code: code('EMP', dbEmployee.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbEmployee.id)
        };
    }

    @Put('one/update/:id')
    async updateEmployee(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateEmployee(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(EmployeeEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('EMP', id) : body.code,
            name: body.name,
            salary: body.salary,
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
        await repo(EmployeeEntity).delete(ids);
        return { success: true };
    }
}

async function validateEmployee(employee) {
    let errors = [];

    let employeeDbCode = await repo(EmployeeEntity).createQueryBuilder('employee').where("employee.code = :code", { code: `${(<string>employee.code)}` }).getOne();
    if (employeeDbCode && employeeDbCode.id != employee.id)
        errors.push("Code existe déjà");

    let employeeDbName = await repo(EmployeeEntity).createQueryBuilder('employee').where("TRIM(LOWER(employee.name)) = :name", { name: `${(<string>employee.name).toLowerCase().trim()}` }).getOne();
    if (employeeDbName && employeeDbName.id != employee.id)
        errors.push("Nom existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(EmployeeEntity)
        .createQueryBuilder('employee')
        .leftJoinAndSelect('employee.createdBy', 'createdBy')
        .leftJoinAndSelect('employee.lastUpdateBy', 'lastUpdateBy')
        .select([
            'employee.id',
            'employee.code',
            'employee.name',
            'employee.salary',
            'employee.debt',
            'employee.phoneNumberOne',
            'employee.phoneNumberTow',
            'employee.postalCode',
            'employee.province',
            'employee.city',
            'employee.address',
            'employee.fax',
            'employee.email',
            'employee.website',
            'employee.notes',
            'employee.createdAt',
            'employee.lastUpdateAt',
            'createdBy',
            'lastUpdateBy'
        ]);
}