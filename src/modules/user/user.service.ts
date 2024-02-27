import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';

@Injectable()
export class UserService {

    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepositoryService,
    ) {}

}
