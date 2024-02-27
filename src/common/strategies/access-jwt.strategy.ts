import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { EEnvVariables } from "../constants/env-variables";

@Injectable()
export class AccessJwtStrategy extends PassportStrategy(Strategy, 'access-jwt') {

    constructor(
        configService: ConfigService,
    ) {
        super({
            secretOrKey: configService.get(EEnvVariables.ACCESS_SECRET),
            ignoreExpiration: false,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: any) {
        return payload;
    }

}