import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/entities';
import { AuthGuard, GetCurrentUser, code, currentDateTime, isEmpty, isNotEmpty, repo } from 'src/utils';
import * as bcrypt from 'bcrypt';
import { config } from 'src/app.config';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {

    @Get('all')
    async getAllUsers() {
        return await queryAll().getMany();
    }

    @Get('one/:id')
    async getOneUserById(@Param('id') id: number) {
        return await queryAll()
            .where('user.id = :id', { id })
            .getOne();
    }

    @Get('pagination')
    async paginateUser(@Query() query) {

        let result = queryAll();

        if (isNotEmpty(query.name))
            result = result.where("TRIM(LOWER(user.name)) LIKE :name", { name: `%${(<string>query.name).toLowerCase().trim()}%` });

        if (isNotEmpty(query.fromCreatedAt) && isNotEmpty(query.toCreatedAt))
            result = result.where('user.createdAt >= :fromCreatedAt', { fromCreatedAt: query.fromCreatedAt })
                .andWhere('user.createdAt <= :toCreatedAt', { toCreatedAt: query.toCreatedAt });

        if (isNotEmpty(query.fromLastUpdateAt) && isNotEmpty(query.toLastUpdateAt))
            result = result.where('user.lastUpdateAt >= :fromLastUpdateAt', { fromLastUpdateAt: query.fromLastUpdateAt })
                .andWhere('user.lastUpdateAt <= :toLastUpdateAt', { toLastUpdateAt: query.toLastUpdateAt });

        result = await result
            .skip(query.pageIndex * query.pageSize)
            .take(query.pageSize)
            .orderBy(`user.createdAt`, query.order);

        let [items, count] = await result.getManyAndCount();

        return {
            order: query.order,
            sort: query.sort,
            pageIndex: query.pageIndex,
            pageSize: query.pageSize,
            items: items,
            count: count,
        };
    }

    @Post('create')
    async createUser(@Body() body, @GetCurrentUser() currentUser) {
        let errors = await validateUser(body);
        if (errors) return { success: false, messages: errors, data: null };

        let creation = {
            code: body.code,
            name: body.name,
            password: await bcrypt.hash(body.password, config.saltOrRounds),
            notes: body.notes,
            createdAt: currentDateTime(),
            createdBy: 1,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };
        let dbUser = await repo(UserEntity).save(creation);

        if (isEmpty(dbUser.code)) await repo(UserEntity).update(dbUser.id, { ...creation, code: code('USR', dbUser.id) });

        return {
            success: true,
            errors: [],
            data: await this.getOneUserById(dbUser.id)
        };
    }

    @Put('one/update/:id')
    async updateUser(@Param('id') id: number, @Body() body, @GetCurrentUser() currentUser) {

        if (id == 1)
            throw new ForbiddenException('Vous ne pouvez pas modifier l’utilisateur admin');


        let errors = await validateUser(body);
        if (errors) return { success: false, messages: errors, data: null };

        let update = {
            id: body.id,
            code: isEmpty(body.code) ? code('USR', id) : body.code,
            name: body.name,
            notes: body.notes,
            lastUpdateAt: currentDateTime(),
            lastUpdateBy: 1
        };

        await repo(UserEntity).update(update.id, update);

        return {
            success: true,
            errors: [],
            data: await this.getOneUserById(update.id)
        };
    }

    @Delete('many')
    async deleteMany(@Query() query) {
        let ids = Object.values(query.id).map(id => parseInt(<any>id)).filter(id => id != 1);
        if (ids.length > 0) {
            await repo(UserEntity).delete(ids);
            return { success: true };
        }
        return { success: false };
    }
}


async function validateUser(user) {
    let errors = [];

    if (await (repo(UserEntity).createQueryBuilder('users').where("TRIM(LOWER(users.name)) = TRIM(LOWER(:name))", { name: user.name })).getExists())
        errors.push("Nom d'utilisateur existe déjà");

    if (isNotEmpty(user.code) && await (repo(UserEntity).createQueryBuilder('users').where("TRIM(users.code) = TRIM(:code)", { code: user.code })).getExists())
        errors.push("Code existe déjà");

    return errors.length == 0 ? null : errors;
}

function queryAll() {
    return repo(UserEntity)
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.createdBy', 'createdBy')
        .leftJoinAndSelect('user.lastUpdateBy', 'lastUpdateBy')
        .select(['user.id', 'user.name', 'user.code', 'user.notes', 'user.createdAt', 'user.lastUpdateAt', 'createdBy', 'lastUpdateBy']);
}