import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { UserRepositoryModule } from 'src/services/repositories/user-repository/user-repository.module';

@Module({
  imports: [
    JwtModule,
    UserRepositoryModule,
  ],
  providers: [AuthService],
  controllers: [AuthController]
})
export class AuthModule {}
