import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";


export type UserDocument = HydratedDocument<User>;

@Schema({
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false }
})
export class User {
    @Prop({required: true, unique: true})
    username: string;

    @Prop({required: true, unique: true})
    email: string;

    @Prop({required: true})
    password: string;

    @Prop()
    avatar: string;

    @Prop()
    refreshToken: string;

    @Prop({type: [{
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: 'chats.chatType',
        },
        chatType: {type: String, enum: ['User', 'Chat']},
    }]})
    chats: {
       chat: Types.ObjectId;
       chatType: 'Chat' | 'User'; 
    }[];
    
    createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);