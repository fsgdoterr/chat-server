import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { UserRepositoryService } from "src/services/repositories/user-repository/user-repository.service";


@Injectable()
export class RefreshJwtGuard extends AuthGuard('refresh-jwt') {

    constructor(private readonly userRepository: UserRepositoryService) {
        super();
    }

    canActivate(context: ExecutionContext) {
        try {
            const req = context.switchToHttp().getRequest();
            const refreshToken = req.cookies['refreshToken'];
    
            const user = this.userRepository.findOne({refreshToken});

            if(!user) throw new Error('');

            return super.canActivate(context);
        } catch(e) {
            throw new UnauthorizedException();
        }
    }

}