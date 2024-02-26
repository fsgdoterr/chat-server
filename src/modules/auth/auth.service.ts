import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';
import { SignUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { instanceToPlain } from 'class-transformer';
import { JwtService } from 'src/services/jwt/jwt.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userRepository: UserRepositoryService,
        private readonly jwt: JwtService,
    ) {}

    async signup({email, password}: SignUpDto) {
        const candidate = await this.userRepository.findOne({email});

        if(candidate)
            throw new BadRequestException('A user with this email already exists')
    
        const hashPassword = await bcrypt.hash(password, 10);

        const username = email.split('@').shift() + '_' + uuid.v4();

        const newUser = await this.userRepository.create({
            email,
            password: hashPassword,
            username,
        });

        const user = await this.userRepository.findById(newUser._id);

        const userData = instanceToPlain(this.userRepository.toResponse(user));

        const { accessToken, refreshToken } = await this.jwt.generateTokens(userData);

        this.userRepository.findByIdAndUpdate(userData.id, {refreshToken});

        return { accessToken, refreshToken };
    }

}
