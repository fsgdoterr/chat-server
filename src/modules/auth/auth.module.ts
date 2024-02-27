import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from 'src/services/jwt/jwt.module';
import { UserRepositoryModule } from 'src/services/repositories/user-repository/user-repository.module';
import { RefreshJwtStrategy } from 'src/common/strategies/refresh-jwt.strategy';
import { RefreshJwtGuard } from 'src/common/guards/refresh-jwt-guard';

@Module({
  imports: [
    JwtModule,
    UserRepositoryModule,
  ],
  providers: [
    AuthService,
    RefreshJwtStrategy,
    RefreshJwtGuard,
  ],
  controllers: [AuthController]
})
export class AuthModule {}
