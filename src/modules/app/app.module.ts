import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule as NestJwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { configModuleOptions } from 'src/config/config';
import { mongooseModuleAsyncOptions } from 'src/config/mongoose';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { RepositoryModule } from 'src/services/repositories/repository/repository.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { ChatModule } from '../chat/chat.module';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
        PassportModule.register({}),
        NestJwtModule.register({}),
        JwtModule,
        RepositoryModule,
        AuthModule,
        UserModule,
        ChatModule,
    ],
})
export class AppModule {}
