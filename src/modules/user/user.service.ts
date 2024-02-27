import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { FileService } from 'src/services/file/file.service';

@Injectable()
export class UserService {

    constructor(
        private readonly configService: ConfigService,
        private readonly userRepository: UserRepositoryService,
        private readonly fileService: FileService,
    ) {}

    async update(
        id: string,
        {email, username}: UpdateUserDto,
        file: Express.Multer.File,
    ) {
        const candidate = await this.userRepository.findById(id, {}, {lean: false});

        if(!candidate)
            throw new UnauthorizedException();

        if(email) candidate.email = email;
        if(username) candidate.username = username;

        if(file) {
            if(candidate.avatar) this.fileService.deleteAvatar(candidate.avatar);
            const avatar = await this.fileService.uploadFile(file);
            candidate.avatar = avatar;
        }

        await candidate.save();

        const userData = await this.userRepository.findById(candidate._id);

        return this.userRepository.toResponse(userData);
    }

}
