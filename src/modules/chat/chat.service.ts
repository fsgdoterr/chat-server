import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatRepositoryService } from 'src/services/repositories/chat-repository/chat-repository.service';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { Types } from 'mongoose';

@Injectable()
export class ChatService {

    constructor(
        private readonly chatRepository: ChatRepositoryService,
        private readonly userRepository: UserRepositoryService,
    ) {}

    async create(
        userId: string,
        {slug, name}: CreateChatDto,
    ) {
        const candidate = await this.chatRepository.findOne({slug});

        if(candidate)
            throw new BadRequestException('Slug dublicate');

        const newChat = await this.chatRepository.create({
            slug,
            name,
            mainOwner: userId,
            members: [userId],
        });

        this.addToChats(newChat._id, userId);

        const chatData = await this.chatRepository.findById(newChat._id, {}, {
            populate: 'mainOwner owners',
        });

        return this.chatRepository.toResponse(chatData);
    }

    private async addToChats(chatId: string | Types.ObjectId, userId: string | Types.ObjectId) {
        return await this.userRepository.findByIdAndUpdate(userId, {
            $addToSet: {chats: {
                chat: chatId,
                chatType: 'Chat',
            }},
        });
    }

}
