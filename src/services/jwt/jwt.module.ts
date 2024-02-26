import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Module({
  providers: [
    NestJwtService,
    JwtService,
  ],
  exports: [JwtService],
})
export class JwtModule {}
