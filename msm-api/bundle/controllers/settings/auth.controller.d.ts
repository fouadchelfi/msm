import { JwtService } from '@nestjs/jwt';
export declare class AuthController {
    private jwtService;
    constructor(jwtService: JwtService);
    signinLocal(body: any): Promise<{
        success: boolean;
        message: string;
        data?: undefined;
    } | {
        data: {
            token: string;
        };
        success: boolean;
        message?: undefined;
    }>;
}
