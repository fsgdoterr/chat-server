import { ConfigService } from "@nestjs/config";
import { MongooseModuleAsyncOptions } from "@nestjs/mongoose";
import { EEnvVariables } from "src/common/constants/env-variables";

export const mongooseModuleAsyncOptions: MongooseModuleAsyncOptions = {
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
        return {
            uri: configService.get(EEnvVariables.MONGO_URL),
            dbName: configService.get(EEnvVariables.MONGO_DB_NAME),
        }
    }
}