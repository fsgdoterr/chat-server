import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EEnvVariables } from "../constants/env-variables";

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {

    constructor(
        configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get(EEnvVariables.REFRESH_SECRET),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromExtractors([req => req?.cookies?.['refreshToken']]),
        });
    }

    async validate(payload: any) {
        return payload;
    }

}