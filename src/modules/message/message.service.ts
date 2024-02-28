import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MessageRepositoryService } from 'src/services/repositories/message-repository/message-repository.service';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatRepositoryService } from 'src/services/repositories/chat-repository/chat-repository.service';
import { UserDocument } from 'src/services/repositories/user-repository/schemas/user.schema';
import { Types } from 'mongoose';

@Injectable()
export class MessageService {

    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepositoryService,
        private readonly chatRepository: ChatRepositoryService,
        private readonly messageRepository: MessageRepositoryService,
    ) {}

    async sendMessage(
        senderId: string,
        receiverId: string,
        dto: SendMessageDto,
    ) {
        if(dto.receiverType === 'Chat') return await this.sendMessageToChat(senderId, receiverId, dto);
        return await this.sendMessageToUser(senderId, receiverId, dto);
    }

    async sendMessageToUser(
        senderId: string,
        receiverId: string,
        { body, receiverType }: SendMessageDto,
    ) {
        const user = await this.userRepository.findById(receiverId);

        if(!user)
            throw new BadRequestException('Invalid id');

        this.userRepository.connectUsers(senderId, receiverId);

        const message = await this.messageRepository.create({
            body,
            receiver: receiverId,
            receiverType,
            sender: senderId,
            senderType: 'User',
        });

        const messageData = await this.messageRepository.findById(message._id, {}, {populate: 'sender'});

        return this.messageRepository.toResponse(messageData);
    }

    async sendMessageToChat(
        senderId: string,
        receiverId: string,
        { body, receiverType }: SendMessageDto,
    ) {
        const chat = await this.chatRepository.findById(receiverId);

        if(!chat)
            throw new BadRequestException('Invalid id');

        if(!chat.members.some((id: unknown) => (id as Types.ObjectId).equals(senderId)))
            throw new ForbiddenException('You are not a chat participant');

        const message = await this.messageRepository.create({
            body,
            receiver: receiverId,
            receiverType,
            sender: senderId,
            senderType: 'User',
        });

        const messageData = await this.messageRepository.findById(message._id, {}, {populate: 'sender'});

        return this.messageRepository.toResponse(messageData);
    }

    async getAll(
        userId: string,
        chatId: string,
        chatType: 'Chat' | 'User',
        limit: number = 20,
        offset: number = 0
    ) {
        if(chatType === 'Chat') return await this.getAllChatMessage(userId, chatId, limit, offset);

        return await this.getAllUserMessage(userId, chatId, limit, offset);
    }

    async getAllChatMessage(
        userId: string,
        chatId: string,
        limit: number = 20,
        offset: number = 0
    ) {
        const chat = await this.chatRepository.findById(chatId);

        if(!chat)
            throw new BadRequestException('Invalid id');

        if(!chat.members.some(member => (member as unknown as Types.ObjectId).equals(userId)))
            throw new ForbiddenException('You are not a chat participant');

        const messages = await this.messageRepository.find({receiver: chatId}, {}, {
            populate: 'sender',
            limit,
            skip: offset,
            sort: { createdAt: -1 },
        });

        return messages.map(this.messageRepository.toResponse);
    }

    async getAllUserMessage(
        userId: string,
        chatId: string,
        limit: number = 20,
        offset: number = 0
    ) {
        const messages = await this.messageRepository.find({
            $or: [
                {receiver: chatId, sender: userId},
                {receiver: userId, sender: chatId},
            ]
        }, {}, {
            populate: 'sender',
            limit,
            skip: offset,
            sort: { createdAt: -1 },
        });

        return messages.map(this.messageRepository.toResponse);  
    }

}
