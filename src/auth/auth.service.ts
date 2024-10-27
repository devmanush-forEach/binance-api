// src/auth/auth.service.ts
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { Response } from 'express';
import * as cookie from 'cookie';
import { JwtService } from '@nestjs/jwt';
import {
  CreateTransactionPassword,
  VerifyTransactionPassword,
} from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

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
  async updateLoginPass(
    userId: string,
    currentPass: string,
    newPass: string,
  ): Promise<any> {
    try {
      const user = await this.userService.findUserById(userId);
      if (!user) throw new Error('Invalida credentials!');
      const validated = await bcrypt.compare(currentPass, user.password);
      if (!validated) throw new Error('Wrong current password!');

      const hashedPassword = await bcrypt.hash(newPass, 10);

      const update = await this.userService.updateUser(userId, {
        password: hashedPassword,
      });
      return update;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  async resetLoginPass(email: string, newPass: string): Promise<any> {
    try {
      const user: any = await this.userService.findUserByEmail(email);
      if (!user) throw new Error('Invalida credentials!');

      const hashedPassword = await bcrypt.hash(newPass, 10);

      const update = await this.userService.updateUser(user._id, {
        password: hashedPassword,
      });
      return update;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  async setTransactionPassword(
    userId: string,
    body: CreateTransactionPassword,
  ): Promise<any> {
    try {
      const user: any = await this.userService.findUserById(userId);
      if (!user) throw new BadRequestException('Please login first!');

      const transactionPassword = body.transactionPassword;
      const hashedPassword = await bcrypt.hash(transactionPassword, 10);

      const update = await this.userService.updateTransactionPasswod(
        user._id,
        hashedPassword,
      );
      if (!update) throw new BadRequestException('UserId is not valid!');
      return update;
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
  async verifyTransactionPassword(
    userId: string,
    body: VerifyTransactionPassword,
  ): Promise<any> {
    try {
      const user: any = await this.userService.findUserById(userId);
      if (!user) throw new BadRequestException('Please login first!');
      const pass = user.transactionPassword;

      const compareResponse = await bcrypt.compare(
        body.transactionPassword,
        user.transactionPassword,
      );
      return compareResponse;
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
        secure: false,
        maxAge: 60 * 60 * 24,
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
