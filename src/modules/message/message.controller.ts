import { Body, ClassSerializerInterceptor, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessageService } from './message.service';
import { AccessJwtGuard } from 'src/common/guards/access-jwt-guard';
import { User } from 'src/common/decorators/user.decorator';
import { SendMessageDto } from './dto/send-message.dto';
import { ChatTypePipe } from 'src/common/pipes/chat-type.pipe';

@Controller('message')
export class MessageController {

    constructor(private readonly messageService: MessageService) {}

    @Post('/:chatId')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async sendMessage(
        @User('id') userId: string,
        @Param('chatId') chatId: string,
        @Body() dto: SendMessageDto,
    ) {
        const message = await this.messageService.sendMessage(userId, chatId, dto);
        return message;
    }

    @Get('/:chatId')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(ClassSerializerInterceptor)
    async getAll(
        @User('id') userId: string,
        @Param('chatId') chatId: string,
        @Query('_limit', new ParseIntPipe({optional: true})) _limit: number,
        @Query('_offset', new ParseIntPipe({optional: true})) _offset: number,
        @Query('_chat-type', new ChatTypePipe()) _chatType: 'User' | 'Chat',
    ) {

        const messages = await this.messageService.getAll(userId, chatId, _chatType, _limit, _offset);
        return messages;
    }

}
