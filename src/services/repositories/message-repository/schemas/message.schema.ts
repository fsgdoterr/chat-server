import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "../../user-repository/schemas/user.schema";
import { Chat } from "../../chat-repository/schemas/chat.schema";


export type MessageDocument = HydratedDocument<Message>;

@Schema({
    versionKey: false,
    timestamps: true
})
export class Message {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'senderType',
        required: true
    })
    sender: User | Chat;

    @Prop({required: true, enum: ['User', 'Chat']})
    senderType: 'User' | 'Chat';

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'receiverType',
        required: true
    })
    receiver: User | Chat;

    @Prop({required: true, enum: ['User', 'Chat']})
    receiverType: 'User' | 'Chat';

    @Prop()
    body: string;
    
    updatedAt: Date;
    createdAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);