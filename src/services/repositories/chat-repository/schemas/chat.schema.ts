import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { User } from "../../user-repository/schemas/user.schema";


export type ChatDocument = HydratedDocument<Chat>;

@Schema({
    versionKey: false,
    timestamps: { createdAt: true, updatedAt: false }
})
export class Chat {
    @Prop({required: true, unique: true})
    slug: string;

    @Prop({required: true})
    name: string;

    @Prop()
    avatar: string;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    mainOwner: User;
    
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    owners: string;
    
    @Prop({type: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]})
    members: string;
    
    createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);