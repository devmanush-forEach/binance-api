// src/auth/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async validateUser(phone: string, password: string): Promise<any> {
    console.log(phone, password)
    const user = await this.userService.findUserByPhone(phone);
    console.log(user)
    if (user && (await bcrypt.compare(password, user.password))) {
      console.log(user);
      // const { password, ...result } = user.toObject();
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
