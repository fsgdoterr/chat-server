import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

interface Options {
    optional?: boolean;
}

@Injectable()
export class ChatTypePipe implements PipeTransform {
    constructor(private readonly options?: Options) {}

    transform(value: any, metadata: ArgumentMetadata) {
        if(this.optional && !value) return;

        if(!value) return 'Chat';
        
        if(value !== 'Chat' && value !== 'User')
            throw new BadRequestException('Invalid chat type');
        
        return value;
    }

    get optional() {
        return this.options && this.options.optional;
    }
}