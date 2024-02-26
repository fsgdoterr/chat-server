import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { configModuleOptions } from 'src/config/config';
import { mongooseModuleAsyncOptions } from 'src/config/mongoose';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
        PassportModule.register({}),
    ],
})
export class AppModule {}
