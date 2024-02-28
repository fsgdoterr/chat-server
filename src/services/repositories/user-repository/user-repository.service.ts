import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { MongoBaseRepository } from 'src/common/database/mongo-base-repository';
import PrivateUserResponseDto from './dto/private-user-response.dto';
import PublicUserResponseDto from './dto/public-user-response.dto';

@Injectable()
export class UserRepositoryService extends MongoBaseRepository<UserDocument> {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {
        super(userModel);
    }

    toResponse(user: UserDocument, modifier: 'public' | 'private' = 'private') {
        if(modifier === 'private') return new PrivateUserResponseDto(user);
        
        return new PublicUserResponseDto(user);
    }

    async connectUsers(firstUserId: string, secondUserId: string) {
        const firstUser = await this.userModel.findById(firstUserId);
        const secondUser = await this.userModel.findById(secondUserId);

        if(!firstUser || !secondUser) return;

        if(!firstUser.chats.some(chat => chat.chat.equals(secondUserId)))
            firstUser.chats.push({chat: new Types.ObjectId(secondUserId), chatType: 'User'});

        if(!secondUser.chats.some(chat => chat.chat.equals(firstUserId)))
            secondUser.chats.push({chat: new Types.ObjectId(firstUserId), chatType: 'User'});

        await firstUser.save();
        await secondUser.save();
    }

}
