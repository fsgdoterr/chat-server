import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepositoryModule } from 'src/services/repositories/user-repository/user-repository.module';
import { AuthModule } from '../auth/auth.module';
import { FileModule } from 'src/services/file/file.module';

@Module({
  imports: [
    UserRepositoryModule,
    AuthModule,
    FileModule,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
