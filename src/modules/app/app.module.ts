import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { configModuleOptions } from 'src/config/config';
import { mongooseModuleAsyncOptions } from 'src/config/mongoose';
import { RepositoryModule } from 'src/services/repositories/repository/repository.module';

@Module({
    imports: [
        ConfigModule.forRoot(configModuleOptions),
        MongooseModule.forRootAsync(mongooseModuleAsyncOptions),
        PassportModule.register({}),
        RepositoryModule,
    ],
})
export class AppModule {}
