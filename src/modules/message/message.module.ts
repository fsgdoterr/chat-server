import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { AuthModule } from '../auth/auth.module';
import { UserRepositoryModule } from 'src/services/repositories/user-repository/user-repository.module';
import { ChatRepositoryModule } from 'src/services/repositories/chat-repository/chat-repository.module';
import { MessageRepositoryModule } from 'src/services/repositories/message-repository/message-repository.module';

@Module({
  imports: [
    AuthModule,
    UserRepositoryModule,
    ChatRepositoryModule,
    MessageRepositoryModule,
  ],
  controllers: [MessageController],
  providers: [MessageService]
})
export class MessageModule {}
