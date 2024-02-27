import { IsNotEmpty, IsString, Matches } from "class-validator";

export class CreateChatDto {
    @IsString()
    @IsNotEmpty()
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Slug should contain only letters, numbers, and underscores' })
    slug: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}