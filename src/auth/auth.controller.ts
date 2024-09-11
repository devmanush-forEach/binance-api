// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.schema';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @Post('register')
  async register(@Body() body: User) {
    return this.userService.createUser(body);
  }

  @Post('login')
  async login(
    @Body() body: { phone: string; password: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.validateUser(body.phone, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const result = await this.authService.login(user, res);
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async updateAccount(@Req() req, @Body() updateData: Partial<User>) {
    return this.userService.updateUser(req.user.userId, updateData);
  }
}
