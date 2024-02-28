import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class SendMessageDto {
    @IsString()
    @IsEnum(['User', 'Chat'])
    receiverType: 'User' | 'Chat';

    @IsString()
    @IsNotEmpty()
    body: string;
}