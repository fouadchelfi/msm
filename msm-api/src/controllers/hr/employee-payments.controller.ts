import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { EmployeePaymentEntity, EmployeeEntity, MoneySourceEntity } from 'src/entities';
import { ManagerService } from 'src/services';
import { AuthGuard, GetCurrentUser, code, currentDate, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';

@UseGuards(AuthGuard)
@Controller('employee-payments')
export class EmployeePaymentsController {

    constructor(private manager: ManagerService) { }

    @Get('all')
    async getAllPayments() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOnePaymentById(@Param('id') id: number) {
        return await queryAll()
            .where('payment.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginatePayment(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.employeeId))
            result = result.where("payment.employeeId = :employeeId", { employeeId: query.employeeId });

        //Should Review
        if (isNotEmpty(query.moneySourceId))
            result = result.andWhere("payment.moneySourceId = :moneySourceId", { moneySourceId: query.moneySourceId });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('payment.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('payment.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('payment.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('payment.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .orderBy(`payment.id`, query.order)
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
    async createPayment(@Body() body, @GetCurrentUser() currentUser) {

        let errors = await validatePayment(body);
        if (errors) return { success: false, errors: errors, data: null };

        let creation = {
            code: body.code,
            employeeId: body.employeeId,
            moneySourceId: body.moneySourceId,
            moneySourceAmount: body.moneySourceAmount,
            payment: body.payment,
            calculatedPayment: body.calculatedPayment,
            restPayment: body.restPayment,
            date: body.date,
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: currentUser?.id,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        };
        let dbPayment = await repo(EmployeePaymentEntity).save(creation);

        if (isEmpty(dbPayment.code)) await repo(EmployeePaymentEntity).update(dbPayment.id, { ...creation, code: code('PME', dbPayment.id) });

        //Sync database changes
        this.manager.updateEmployeeDebt(creation.employeeId, creation.restPayment, 'replace')
        this.manager.updateMoneySourceAmount(creation.moneySourceId, -creation.payment, 'add');

        return {
            success: true,
            errors: [],
            data: await this.getOnePaymentById(dbPayment.id)
        };
    }

    @Put('one/update/:id')
    async updatePayment(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {
        let errors = await validatePayment(body);
        if (errors) return { success: false, errors: errors, data: null };

        await repo(EmployeePaymentEntity).update(body.id, {
            id: body.id,
            code: isEmpty(body.code) ? code('PME', id) : body.code,
            employeeId: body.employeeId,
            moneySourceId: body.moneySourceId,
            moneySourceAmount: body.moneySourceAmount,
            payment: body.payment,
            calculatedPayment: body.calculatedPayment,
            restPayment: body.restPayment,
            date: body.date,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: currentUser?.id,
        });

        return {
            success: true,
            errors: [],
            data: await this.getOnePaymentById(body.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id));
        await repo(EmployeePaymentEntity).delete(ids);
        return { success: true };
    }
}

async function validatePayment(payment) {
    let errors = [];

    let paymentDbCode = await repo(EmployeePaymentEntity).createQueryBuilder('payment').where("payment.code = :code", { code: `${(<string>payment.code)}` }).getOne();
    if (paymentDbCode && paymentDbCode.id != payment.id)
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(EmployeePaymentEntity)
        .createQueryBuilder('payment')
        .leftJoinAndSelect('payment.createdBy', 'createdBy')
        .leftJoinAndSelect('payment.lastUpdateBy', 'lastUpdateBy')
        .leftJoinAndSelect('payment.employeeId', 'employeeId')
        .leftJoinAndSelect('payment.moneySourceId', 'moneySourceId')
        .select(['payment.id', 'payment.code', 'employeeId', 'moneySourceId', 'payment.payment', 'payment.moneySourceAmount', 'payment.calculatedPayment', 'payment.restPayment', 'payment.date', 'payment.notes', 'payment.createdAt', 'payment.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}