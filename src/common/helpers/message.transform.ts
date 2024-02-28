import { TransformFnParams, instanceToPlain } from "class-transformer";
import { ChatResponseDto } from "src/services/repositories/chat-repository/dto/chat-response.dto";
import PublicUserResponseDto from "src/services/repositories/user-repository/dto/public-user-response.dto";

export const senderTransform = ({value, obj}: TransformFnParams) => {
    if(value.constructor.name === 'ObjectId') return value.toString();
    
    if(obj.senderType === 'Chat')
        return instanceToPlain(new ChatResponseDto(value));       

    return instanceToPlain(new PublicUserResponseDto(value));
}