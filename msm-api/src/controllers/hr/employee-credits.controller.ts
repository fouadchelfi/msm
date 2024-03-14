import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { EmployeeCreditEntity, EmployeeEntity, MoneySourceEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

// @UseGuards(AuthGuard)
@Controller('employee-credits')
export class EmployeeCreditsController {

    @Get('all')
    async getAllCredits() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneCreditById(@Param('id') id: number) {
        return await queryAll()
            .where('credit.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateCredit(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.employeeId))
            result = result.where("credit.employeeId = :employeeId", { employeeId: query.employeeId });

        //Should Review
        if (isNotEmpty(query.moneySourceId))
            result = result.andWhere("credit.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('credit.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('credit.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('credit.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('credit.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`credit.id`, query.order)
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
    async createCredit(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validateCredit(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            employeeId: body.employeeId,
            moneySourceId: body.moneySourceId,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbCredit = await repo(EmployeeCreditEntity).save(creation);

        if (isEmpty(dbCredit.code)) await repo(EmployeeCreditEntity).update(dbCredit.id, { ...creation, code: code('ACC', dbCredit.id) });

        //Increase amount in the given employee.
        let employee = await repo(EmployeeEntity)
            .createQueryBuilder('employee')
            .where('employee.id = :id', { id: creation.employeeId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(EmployeeEntity)
            .set({ debt: parseFloat(employee.debt) + parseFloat(creation.amount) })
            .where("id = :id", { id: creation.employeeId })
            .execute();

        //Decrease amount in the given money source.
        let source = await repo(MoneySourceEntity)
            .createQueryBuilder('source')
            .where('source.id = :id', { id: creation.moneySourceId })
            .getOne();
        await AppDataSource
            .createQueryBuilder()
            .update(MoneySourceEntity)
            .set({ amount: parseFloat(source.amount) - parseFloat(creation.amount) })
            .where("id = :id", { id: creation.moneySourceId })
            .execute();

        return {
            success: true,
            errors: [],
            data: await this.getOneCreditById(dbCredit.id)
        };
    }

    @Put('one/update/:id')
    async updateCredit(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateCredit(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(EmployeeCreditEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('ACC', id) : body.code,
            employeeId: body.employeeId,
            moneySourceId: body.moneySourceId,
            amount: body.amount,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        });

        return {
            success: true,
            errors: [],
            data: await this.getOneCreditById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        await repo(EmployeeCreditEntity).delete(ids);
        return { success: true };
    }
}

async function validateCredit(credit) {
    let errors = [];

    let creditDbCode = await repo(EmployeeCreditEntity).createQueryBuilder('credit').where("credit.code = :code", { code: `${(<string>credit.code)}` }).getOne();
    if (creditDbCode && creditDbCode.id != credit.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(EmployeeCreditEntity)
        .createQueryBuilder('credit')
        .leftJoinAndSelect('credit.createdBy', 'createdBy')
        .leftJoinAndSelect('credit.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('credit.employeeId', 'employeeId')
        .leftJoinAndSelect('credit.moneySourceId', 'moneySourceId')
        .select(['credit.id', 'credit.code', 'employeeId', 'moneySourceId', 'credit.amount', 'credit.date', 'credit.notes', 'credit.createdAt', 'credit.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}