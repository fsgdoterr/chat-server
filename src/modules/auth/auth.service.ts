import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRepositoryService } from 'src/services/repositories/user-repository/user-repository.service';
import { SignUpDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import * as uuid from 'uuid';
import { instanceToPlain } from 'class-transformer';
import { JwtService } from 'src/services/jwt/jwt.service';
import { SignInDto } from './dtos/signin.dto';
import { Types } from 'mongoose';

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

        return await this.refresh(newUser._id);
    }

    async signin({usernameEmail, password}: SignInDto) {
        const candidate = await this.userRepository.findOne({$or: [
            {email: usernameEmail},
            {username: usernameEmail}
        ]});

        if(!candidate)
            throw new BadRequestException('This user does not exist');

        const isEqual = await bcrypt.compare(password, candidate.password);

        if(!isEqual)
            throw new BadRequestException('This user does not exist');

        return await this.refresh(candidate._id);
    }

    async refresh(id: string | Types.ObjectId) {
        const candidate = await this.userRepository.findById(id);
        if(!candidate)
            throw new UnauthorizedException();

        const userData = instanceToPlain(this.userRepository.toResponse(candidate));

        const { accessToken, refreshToken } = await this.jwt.generateTokens(userData);

        this.userRepository.findByIdAndUpdate(userData.id, {refreshToken});
    
        return { accessToken, refreshToken };
    }

}
