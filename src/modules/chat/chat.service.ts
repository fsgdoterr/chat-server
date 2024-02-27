import { Injectable } from '@nestjs/common';
import { ChatRepositoryService } from 'src/services/repositories/chat-repository/chat-repository.service';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';

@Injectable()
export class ChatService {

    constructor(
        private readonly chatRepository: ChatRepositoryService,
        private readonly userRepository: UserRepositoryService,
    ) {}

}
