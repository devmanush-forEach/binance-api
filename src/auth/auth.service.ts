// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as cookie from 'cookie';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(phone: string, password: string): Promise<any> {
    const user = await this.userService.findUserByPhone(phone);
    if (user && (await bcrypt.compare(password, user.password))) {
      // const { password, ...result } = user.toObject();
      const { password, ...result } = user;
      return result;
    }
    return null;
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

    return {
      message: 'Login successful',
      user: { email: user.email, role: user.role },
    };
  }
}
