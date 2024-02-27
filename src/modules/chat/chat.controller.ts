import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Param, Post, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessJwtGuard } from 'src/common/guards/access-jwt-guard';
import { User } from 'src/common/decorators/user.decorator';
import { CreateChatDto } from './dtos/create-chat.dto';
import { UpdateChatDto } from './dtos/update-chat.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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

}
