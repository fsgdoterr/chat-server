import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { EEnvVariables } from 'src/common/constants/env-variables';

@Injectable()
export class JwtService {

    constructor(
        private readonly jwt: NestJwtService,
        private readonly configService: ConfigService,
    ) {}

    private getSecret() {
        return {
            atSecret: this.configService.get(EEnvVariables.ACCESS_SECRET),
            rtSecret: this.configService.get(EEnvVariables.REFRESH_SECRET),
        }
    }

    async generateTokens(payload: any) {
        const { atSecret, rtSecret } = this.getSecret();

        const accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '30m',
            secret: atSecret,
        });
        const refreshToken = await this.jwt.signAsync(payload, {
            expiresIn: '7d',
            secret: rtSecret,
        });

        return { accessToken, refreshToken };
    }

    async verifyAccess(token: string) {
        const { atSecret } = this.getSecret();

        try {
            const data = await this.jwt.verifyAsync(token, {secret: atSecret});
            return data;
        } catch(e) {
            return null;
        }
    }

    async verifyRefresh(token: string) {
        const { rtSecret } = this.getSecret();

        try {
            const data = await this.jwt.verifyAsync(token, {secret: rtSecret});
            return data;
        } catch(e) {
            return null;
        }
    }

}
