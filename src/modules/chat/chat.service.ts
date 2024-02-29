import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ChatRepositoryService } from 'src/services/repositories/chat-repository/chat-repository.service';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';
import { CreateChatDto } from './dtos/create-chat.dto';
import mongoose, { Types } from 'mongoose';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { FileService } from 'src/services/file/file.service';
import { UserDocument } from 'src/services/repositories/user-repository/schemas/user.schema';
import { ChatDocument } from 'src/services/repositories/chat-repository/schemas/chat.schema';

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

    async enter(userId: string, chatId: string) {

        const chat = await this.chatRepository.findByIdAndUpdate(chatId, {
            $addToSet: {members: userId},
        });

        if(!chat)
            throw new BadRequestException('Invalid id');

        this.addToChats(chatId, userId);

        const chatData = await this.chatRepository.findById(chat._id);

        return this.chatRepository.toResponse(chatData);
    }

    async exit(userId: string, chatId: string) {
        const chat = await this.chatRepository.findByIdAndUpdate(chatId, {
            $pull: {
                members: userId,
                owners: userId,
            }
        });

        if(!chat)
            throw new BadRequestException('Invalid id');

        await this.userRepository.findByIdAndUpdate(userId, {
            $pull: {
                chats: { chat: chatId },
            }
        });

    }

    async delete(userId: string, chatId: string) {
        const chat = await this.chatRepository.findOne({_id: chatId, mainOwner: userId});

        if(!chat)
            throw new BadRequestException('Invalid id, or you dont have permissions');

        if(chat.members.length > 1)
            throw new BadRequestException('You can\'t delete a chat if there are still participants in it');

        await this.chatRepository.findByIdAndDelete(chatId);

        this.userRepository.findByIdAndUpdate(userId, {
            $pull: {
                chats: { chat: chatId },
            }
        });

        return;
    }

    async kick(
        userId: string,
        chatId: string,
        kickUserId: string,
    ) {

        const chat = await this.chatRepository.findOneAndUpdate({
            _id: chatId,
            $or: [
                {mainOwner: userId},
                {owners: userId},
            ],
        }, {
            $pull: {
                members: userId,
                owners: userId,
            }
        });

        if(!chat)
            throw new ForbiddenException('You dont have permissions');

        this.userRepository.findByIdAndUpdate(kickUserId, {
            $pull: {
                chats: { chat: chatId },
            }
        });

        return;
    }

    async getAll(
        userId: string,
    ) { 
        const user = await this.userRepository.findById(userId, {}, {populate: 'chats.chat'});

        const chats = user.chats.map(c => {
            const chat = c.chatType === 'Chat'
                ? this.chatRepository.toResponse(c.chat as unknown as ChatDocument)
                : this.userRepository.toResponse(c.chat as unknown as UserDocument, 'public');

            return {
                chatType: c.chatType,
                chat,
            }
        })

        return chats;
    }

    async search(
        userId: string,
        search: string,
        chatType?: 'Chat' | 'User',
        limit: number = 10,
        offset: number = 0
    ) {
        const response: {
            chats?: any[],
            chatsCount?: number,
            users?: any[],
            usersCount?: number;
        } = {};
        if(chatType === 'Chat' || !chatType) {
            const query = {
                $or: [{slug: new RegExp(search, 'i')}, {name: new RegExp(search, 'i')}]
            };

            response.chats = await this.chatRepository.find(query, {}, {populate: 'mainOwner owners', limit, skip: offset});
            response.chatsCount = await this.chatRepository.countDocuments(query);
        }
        if(chatType === 'User'|| !chatType) {
            const query = {
                username: new RegExp(search, 'i'),
            };

            response.users = await this.userRepository.find(query, {}, {limit, skip: offset});
            response.usersCount = await this.userRepository.countDocuments(query);
        }

        if(response.chats) response.chats = response.chats.map(c => this.chatRepository.toResponse(c));
        if(response.users) response.users = response.users.map(u => this.userRepository.toResponse(u, 'public'));

        return response;
    }

    private async addToChats(chatId: string | Types.ObjectId, userId: string | Types.ObjectId) {
        const user = await this.userRepository.findById(userId);
        const chatExists = user.chats.some(chat => chat.chat.equals(chatId));

        if(chatExists) return;

        return await this.userRepository.findByIdAndUpdate(userId, {
            $addToSet: {chats: {
                chat: chatId,
                chatType: 'Chat',
            }},
        });
    }

}
