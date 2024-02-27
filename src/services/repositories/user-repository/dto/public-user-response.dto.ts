import { Exclude, Expose } from "class-transformer";
import { Types } from "mongoose";

export default class PublicUserResponseDto {
    @Exclude()
    _id: Types.ObjectId;

    @Expose()
    get id() {
        return this._id.toString();
    }

    username: string;
    avatar: string;
    
    @Exclude()
    email: string;

    @Exclude()
    password: string;

    @Exclude()
    refreshToken: string;

    @Exclude()
    chats: any;
    
    @Exclude()
    createdAt: Date;

    constructor(data: Partial<PublicUserResponseDto>) {
        Object.assign(this, data);
    }
}