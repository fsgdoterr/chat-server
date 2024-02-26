import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../user-repository/user-repository.module';
import { ChatRepositoryModule } from '../chat-repository/chat-repository.module';
import { MessageRepositoryModule } from '../message-repository/message-repository.module';

@Module({
    imports: [
        UserRepositoryModule,
        ChatRepositoryModule,
        MessageRepositoryModule,
    ],
})
export class RepositoryModule {}
