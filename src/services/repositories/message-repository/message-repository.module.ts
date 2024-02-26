import { Module } from '@nestjs/common';
import { MessageRepositoryService } from './message-repository.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from './schemas/message.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Message.name, schema: MessageSchema}])],
  providers: [MessageRepositoryService],
  exports: [MessageRepositoryService],
})
export class MessageRepositoryModule {}
