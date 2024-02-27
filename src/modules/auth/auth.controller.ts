import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dtos/signup.dto';
import { ETime } from 'src/common/constants/time';
import { SignInDto } from './dtos/signin.dto';
import { RefreshJwtGuard } from 'src/common/guards/refresh-jwt-guard';
import { User } from 'src/common/decorators/user.decorator';

@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    async signup(
        @Res({passthrough: true}) res,
        @Body() dto: SignUpDto,
    ) {
        const {refreshToken, accessToken} = await this.authService.signup(dto);
    
        res.cookie('refreshToken', refreshToken, { maxAge: 7 * ETime.DAY, httpOnly: true });

        return {token: accessToken};
    }

    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    async signin(
        @Res({passthrough: true}) res,
        @Body() dto: SignInDto,
    ) {
        const {refreshToken, accessToken} = await this.authService.signin(dto);
    
        res.cookie('refreshToken', refreshToken, { maxAge: 7 * ETime.DAY, httpOnly: true });

        return {token: accessToken};
    }
    
    @Get('/refresh')
    @UseGuards(RefreshJwtGuard)
    async refresh(
        @Res({passthrough: true}) res,
        @User('id') id: string,
    ) {
        const { accessToken, refreshToken } = await this.authService.refresh(id);
    
        res.cookie('refreshToken', refreshToken, { maxAge: 7 * ETime.DAY, httpOnly: true });

        return {token: accessToken};
    }

}
