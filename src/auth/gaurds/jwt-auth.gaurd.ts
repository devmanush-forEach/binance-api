// src/auth/guards/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  // constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Token not found in cookies');
    }

    try {
      // const decoded = this.jwtService.verify<any>(token);
      // return { userId: decoded.sub, email: decoded.email, role: decoded.role };
      request.params.userId = 'decoded.sub';
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
