import { TransformFnParams, instanceToPlain } from "class-transformer";
import PublicUserResponseDto from "src/services/repositories/user-repository/dto/public-user-response.dto";

export const userTransform = ({value}: TransformFnParams) => {
    if(Array.isArray(value))
        return value.map(transform);

    return transform(value);
}

const transform = (value: any) => {
    try {
        if(value.constructor.name === 'ObjectId') return value.toString();
        return instanceToPlain(new PublicUserResponseDto(value));
    } catch(e) {
        return value;
    }
}