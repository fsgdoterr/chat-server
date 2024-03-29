import { Injectable } from '@nestjs/common';
import { MongoBaseRepository } from 'src/common/database/mongo-base-repository';
import { Message, MessageDocument } from './schemas/message.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import MessageResponseDto from './dto/message-response.dto';

@Injectable()
export class MessageRepositoryService extends MongoBaseRepository<MessageDocument> {

    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<MessageDocument>
    ) {
        super(messageModel);
    }

    toResponse(message: MessageDocument) {
        return new MessageResponseDto(message);
    }

}