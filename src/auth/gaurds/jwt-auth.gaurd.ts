// src/auth/guards/jwt-auth.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/dto/user.dto';
import { ROLES_KEY } from './roles.decorator';
import { RequestWithUser } from '../auth.interface';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = request.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Token not found in cookies');
    }

    try {
      const decoded = this.jwtService.verify<any>(token);
      if (!decoded.sub)
        throw new UnauthorizedException('Invalid or expired token');

      request.params.userId = decoded.sub;
      request.user = {
        id: decoded.sub,
        roles: decoded.roles || [],
      };

      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (requiredRoles && requiredRoles.length > 0) {
        const hasRole = () =>
          request.user.roles.some((role: Role) => requiredRoles.includes(role));

        if (!hasRole()) {
          throw new ForbiddenException(
            'You do not have permission (roles) to access this resource',
          );
        }
      }

      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
