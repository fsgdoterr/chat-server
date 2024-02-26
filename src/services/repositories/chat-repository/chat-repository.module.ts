import { Module } from '@nestjs/common';
import { ChatRepositoryService } from './chat-repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './schemas/chat.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Chat.name, schema: ChatSchema}])],
  providers: [ChatRepositoryService],
  exports: [ChatRepositoryService],
})
export class ChatRepositoryModule {}
