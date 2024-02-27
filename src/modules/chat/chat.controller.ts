import { Body, ClassSerializerInterceptor, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AccessJwtGuard } from 'src/common/guards/access-jwt-guard';
import { User } from 'src/common/decorators/user.decorator';
import { CreateChatDto } from './dtos/create-chat.dto';

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

}
