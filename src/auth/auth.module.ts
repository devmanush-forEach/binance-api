// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { JwtAuthGuard } from './gaurds/jwt-auth.gaurd';

@Module({
  imports: [
    UserModule,
    PassportModule,
    WalletModule,
    JwtModule.register({
      secret: 'your_secret_key',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  providers: [AuthService, JwtStrategy, JwtService],
  controllers: [AuthController],
  exports: [AuthService, JwtService],
})
export class AuthModule {}
