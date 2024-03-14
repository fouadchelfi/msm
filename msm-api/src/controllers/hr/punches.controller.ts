import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { EmployeeEntity, PuncheEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('punches')
export class PunchesController {

    @Get('all')
    async getAllPunches() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCategoyById(@Param('id') id: number) {
        return await queryAll()
            .where('punche.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginatePunche(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.employeeId))
            result = result.where("punche.employeeId = :employeeId", { employeeId: query.employeeId });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('punche.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('punche.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('punche.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('punche.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`punche.id`, query.order)
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
    async createPunche(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validatePunche(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            employeeId: body.employeeId,
            hourlyCoefficient: body.hourlyCoefficient,
            salary: body.salary,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbPunche = await repo(PuncheEntity).save(creation);

        if (isEmpty(dbPunche.code)) await repo(PuncheEntity).update(dbPunche.id, { ...creation, code: code('PTG', dbPunche.id) });

        //Increase amount in the given employee.
        let employee = await repo(EmployeeEntity)
            .createQueryBuilder('employee')
            .where('employee.id = :id', { id: creation.employeeId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(EmployeeEntity)
            .set({ debt: parseFloat(employee.debt) + (parseFloat(employee.salary) / 26) * parseFloat(creation.hourlyCoefficient) })
            .where("id = :id", { id: creation.employeeId })
            .execute();

        return {
            success: true,
            errors: [],
            data: await this.getOneCategoyById(dbPunche.id)
        };
    }

    @Put('one/update/:id')
    async updatePunche(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validatePunche(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(PuncheEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('PTG', id) : body.code,
            employeeId: body.employeeId,
            hourlyCoefficient: body.hourlyCoefficient,
            salary: body.salary,
            amount: body.amount,
            date: body.date,
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
        await repo(PuncheEntity).delete(ids);
        return { success: true };
    }
}

async function validatePunche(punche) {
    let errors = [];

    let puncheDbCode = await repo(PuncheEntity).createQueryBuilder('punche').where("punche.code = :code", { code: `${(<string>punche.code)}` }).getOne();
    if (puncheDbCode && puncheDbCode.id != punche.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(PuncheEntity)
        .createQueryBuilder('punche')
        .leftJoinAndSelect('punche.createdBy', 'createdBy')
        .leftJoinAndSelect('punche.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('punche.employeeId', 'employeeId')
        .select(['punche.id', 'punche.code', 'employeeId', 'punche.hourlyCoefficient', 'punche.salary', 'punche.amount', 'punche.date', 'punche.notes', 'punche.createdAt', 'punche.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}