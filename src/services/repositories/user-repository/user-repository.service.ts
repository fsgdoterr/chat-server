import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { MongoBaseRepository } from 'src/common/database/mongo-base-repository';
import { UserResponseDto } from './dto/user-response.dto';

@Injectable()
export class UserRepositoryService extends MongoBaseRepository<UserDocument> {

    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>
    ) {
        super(userModel);
    }

    toResponse(user: UserDocument) {
        return new UserResponseDto(user);
    }

}
