import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ChatTypePipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(!value) return 'Chat';
        
        if(value !== 'Chat' && value !== 'User')
            throw new BadRequestException('Invalid chat type');
        
        return value;
    }
}