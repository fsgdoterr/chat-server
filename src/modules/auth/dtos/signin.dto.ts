import { IsNotEmpty, IsString } from "class-validator";

export class SignInDto {

    @IsString()
    @IsNotEmpty()
    usernameEmail: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}