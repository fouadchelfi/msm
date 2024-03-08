import { Body, Controller, Post } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from 'src/entities';
import { repo } from 'src/utils';
import * as bcrypt from 'bcrypt';

@Controller('auth')
export class AuthController {

    constructor(private jwtService: JwtService) { }

    @Post('local/login')
    async signinLocal(@Body() body: any) {

        let user = await repo(UserEntity).createQueryBuilder('user').where("TRIM(LOWER(user.name)) = TRIM(LOWER(:name))", { name: body.name }).getOne();

        if (!user || !(await bcrypt.compare(body.password, user.password)))
            return { success: false, message: "Nom d'utilisateur ou mot de passe incorrect!" };

        return {
            data: {
                token: this.jwtService.sign({ id: user.id, name: user.name }, { secret: 'super-secret-cat', }),
            },
            success: true
        };
    }
}