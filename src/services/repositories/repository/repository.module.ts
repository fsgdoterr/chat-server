import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../user-repository/user-repository.module';
import { ChatRepositoryModule } from '../chat-repository/chat-repository.module';

@Module({
    imports: [
        UserRepositoryModule,
        ChatRepositoryModule,
    ],
})
export class RepositoryModule {}
