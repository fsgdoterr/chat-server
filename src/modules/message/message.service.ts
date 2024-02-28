import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ChatRepositoryModule } from 'src/services/repositories/chat-repository/chat-repository.module';
import { MessageRepositoryService } from 'src/services/repositories/message-repository/message-repository.service';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';

@Injectable()
export class MessageService {

    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepositoryService,
        private readonly chatRepository: ChatRepositoryModule,
        private readonly messageRepository: MessageRepositoryService,
    ) {}

    

}
