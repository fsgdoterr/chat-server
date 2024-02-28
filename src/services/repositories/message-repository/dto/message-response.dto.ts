import { Exclude, Expose, Transform } from "class-transformer";
import { Types } from "mongoose";
import { User } from "../../user-repository/schemas/user.schema";
import { Chat } from "../../chat-repository/schemas/chat.schema";
import { senderTransform } from "src/common/helpers/message.transform";

export default class MessageResponseDto {

    @Exclude()
    _id: Types.ObjectId;

    @Expose()
    get id() {
        return this._id.toString();
    }

    @Transform(senderTransform)
    sender: User | Chat;

    senderType: 'User' | 'Chat';

    @Exclude()
    receiver: User | Chat;
    @Exclude()
    receiverType: 'User' | 'Chat';

    body: string;
    updatedAt: Date;
    createdAt: Date;

    constructor(data: Partial<MessageResponseDto>) {
        Object.assign(this, data);
    }
}