import { Injectable } from '@nestjs/common';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepositoryService,
    ) {}

}
