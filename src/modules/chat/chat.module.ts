import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { UserRepositoryModule } from 'src/services/repositories/user-repository/user-repository.module';
import { ChatRepositoryModule } from 'src/services/repositories/chat-repository/chat-repository.module';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from 'src/services/file/file.module';

@Module({
  imports: [
    UserRepositoryModule,
    ChatRepositoryModule,
    AuthModule,
    FileModule,
  ],
  controllers: [ChatController],
  providers: [ChatService]
})
export class ChatModule {}
