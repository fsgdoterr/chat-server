import { Exclude, Expose, Transform } from "class-transformer";
import { Types } from "mongoose";
import { User } from "../../user-repository/schemas/user.schema";
import { userTransform } from "src/common/helpers/user.transform";

export class ChatResponseDto {
    
    @Exclude()
    _id: Types.ObjectId;

    @Expose()
    get id() {
        return this._id.toString();
    }

    slug: string;
    name: string;
    avatar: string;
    createdAt: Date;

    @Transform(userTransform)
    mainOwner: User;
    
    @Transform(userTransform)
    owners: User[];

    @Exclude()
    members: User[];

    constructor(data: Partial<ChatResponseDto>) {
        Object.assign(this, data);
    }
}