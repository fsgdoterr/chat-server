import { Body, ClassSerializerInterceptor, Controller, Param, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { MessageService } from './message.service';
import { AccessJwtGuard } from 'src/common/guards/access-jwt-guard';
import { User } from 'src/common/decorators/user.decorator';
import { SendMessageDto } from './dto/send-message.dto';

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

}
