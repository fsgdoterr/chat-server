import { Body, ClassSerializerInterceptor, Controller, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessJwtGuard } from 'src/common/guards/access-jwt-guard';
import { User } from 'src/common/decorators/user.decorator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Put('/')
    @UseGuards(AccessJwtGuard)
    @UseInterceptors(FileInterceptor('avatar'), ClassSerializerInterceptor)
    async update(
        @User('id') userId: string,
        @Body() dto: UpdateUserDto,
        @UploadedFile() avatar: Express.Multer.File,
    ) {
        return await this.userService.update(userId, dto, avatar);
    }

}
