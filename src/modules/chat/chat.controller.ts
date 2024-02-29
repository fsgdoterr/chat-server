import { Body, ClassSerializerInterceptor, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessJwtGuard } from 'src/common/guards/access-jwt-guard';
import { User } from 'src/common/decorators/user.decorator';
import { CreateChatDto } from './dtos/create-chat.dto';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChatTypePipe } from 'src/common/pipes/chat-type.pipe';

@Controller('chat')
export class ChatController {

    constructor(private readonly chatService: ChatService) {}

    @Post('/')
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async create(
        @User('id') userId: string,
        @Body() dto: CreateChatDto,
    ) {
        return await this.chatService.create(userId, dto);
    }

    @Put('/:chatId')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(FileInterceptor('avatar'), ClassSerializerInterceptor)
    async update(
        @Param('chatId') chatId: string,
        @User('id') userId: string,
        @Body() dto: UpdateChatDto,
        @UploadedFile() file: Express.Multer.File
    ) {
        return await this.chatService.update(chatId, userId, dto, file);
    }

    @Get('/enter/:chatId')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async enter(
        @User('id') userId: string,
        @Param('chatId') chatId: string,
    ) {
        return await this.chatService.enter(userId, chatId);
    }

    @Delete('/exit/:chatId')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async exit(
        @User('id') userId: string,
        @Param('chatId') chatId: string,
    ) {
        this.chatService.exit(userId, chatId);
        return;
    }

    @Delete('/:chatId')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async delete(
        @User('id') userId: string,
        @Param('chatId') chatId: string,
    ) {
        await this.chatService.delete(userId, chatId);
        return;
    }

    @Delete('/kick/:chatId/:userId')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async kick(
        @User('id') userId: string,
        @Param('chatId') chatId: string,
        @Param('userId') kickUserId: string,
    ) {
        await this.chatService.kick(userId, chatId, kickUserId);
        return;
    }

    @Get('/')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async getAll(
        @User('id') userId: string,
    ) {
        return await this.chatService.getAll(userId);
    }

    @Get('/search/:search')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async search(
        @User('id') userId: string,
        @Param('search') search: string,
        @Query('_limit', new ParseIntPipe({optional: true})) _limit: number,
        @Query('_offset', new ParseIntPipe({optional: true})) _offset: number,
        @Query('_chat-type', new ChatTypePipe({optional: true})) _chatType: 'User' | 'Chat',
        @Res({passthrough: true}) res,
    ) {
        const response = await this.chatService.search(userId, search, _chatType, _limit, _offset);
        if(_chatType === 'Chat') {
            res.setHeader('x-chats-total-count', response.chatsCount);
            return {chats: response.chats};
        }
        if(_chatType === 'User') {
            res.setHeader('x-users-total-count', response.usersCount);
            return {users: response.users};
        }
        res.setHeader('x-chats-total-count', response.chatsCount);
        res.setHeader('x-users-total-count', response.usersCount);
        return {
            users: response.users,
            chats: response.chats
        };
    }

}
