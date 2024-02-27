import { Exclude, Expose } from "class-transformer";
import { Types } from "mongoose";

export default class PrivateUserResponseDto {
    @Exclude()
    _id: Types.ObjectId;

    @Expose()
    get id() {
        return this._id.toString();
    }

    username: string;
    email: string;
    avatar: string;

    @Exclude()
    password: string;

    @Exclude()
    refreshToken: string;

    @Exclude()
    chats: any;
    
    createdAt: Date;

    constructor(data: Partial<PrivateUserResponseDto>) {
        Object.assign(this, data);
    }
}