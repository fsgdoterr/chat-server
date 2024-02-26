import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { ETime } from 'src/common/constants/time';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/signup')
    @HttpCode(HttpStatus.OK)
    async signup(
        @Res({passthrough: true}) res,
        @Body() dto: SignUpDto,
    ) {
        const {refreshToken, accessToken} = await this.authService.signup(dto);
    
        res.cookie('refreshToken', refreshToken, { maxAge: 7 * ETime.DAY, httpOnly: true });

        return {token: accessToken};
    }

}
