import { Injectable } from '@nestjs/common';
import { MongoBaseRepository } from 'src/common/database/mongo-base-repository';
import { Chat, ChatDocument } from './schemas/chat.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ChatRepositoryService extends MongoBaseRepository<ChatDocument> {

    constructor(
        @InjectModel(Chat.name)
        private readonly chatModel: Model<ChatDocument>
    ) {
        super(chatModel);
    }

}
