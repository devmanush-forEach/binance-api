// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.userService.findUserByPhone(phone);
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return { ...result };
    }
    return null;
  }

  async validateUserByToken(token: string): Promise<any> {
    try {
      const decoded = this.jwtService.verify<any>(token);
      return { userId: decoded.sub, email: decoded.email, role: decoded.role };
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  async login(user: any, res: Response) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    const token = this.jwtService.sign(payload);
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('access_token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60,
        sameSite: 'strict',
        path: '/',
      }),
    );

    const { role, updatedAt, createdAt, ...result } = user;

    return {
      message: 'Login successful',
      user: result,
    };
  }
}
