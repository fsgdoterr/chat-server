import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatRepositoryService } from 'src/services/repositories/chat-repository/chat-repository.service';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import { Types } from 'mongoose';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { FileService } from 'src/services/file/file.service';

@Injectable()
export class ChatService {

    constructor(
        private readonly chatRepository: ChatRepositoryService,
        private readonly userRepository: UserRepositoryService,
        private readonly fileService: FileService,
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

    async update(
        chatId: string,
        userId: string,
        {name, slug}: UpdateChatDto,
        file: Express.Multer.File
    ) {
        const chat = await this.chatRepository.findOne({
            _id: chatId,
            $or: [
                {mainOwner: userId},
                {owners: userId},
            ]
        }, {}, {lean: false});

        if(!chat)
            throw new BadRequestException('This chat does not exist or you do not have rights');

        if(name) chat.name = name;
        if(slug) {
            const candidate = await this.chatRepository.findOne({slug});
            if(candidate)
                throw new BadRequestException('Slug dublicate');

            chat.slug = slug;
        }

        if(file) {
            if(chat.avatar) this.fileService.deleteAvatar(chat.avatar);
            const avatar = await this.fileService.uploadFile(file);
            chat.avatar = avatar;
        }

        await chat.save();

        const chatData = await this.chatRepository.findById(chat._id);

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
