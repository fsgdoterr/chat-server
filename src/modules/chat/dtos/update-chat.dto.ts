import { IsNotEmpty, IsOptional, IsString, Matches } from "class-validator";

export class UpdateChatDto {
    @IsString()
    @IsOptional()
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'Slug should contain only letters, numbers, and underscores' })
    slug: string;

    @IsString()
    @IsOptional()
    name: string;
}