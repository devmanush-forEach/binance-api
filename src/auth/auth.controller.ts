// src/auth/auth.controller.ts
import {
  Controller,
  Post,
  Body,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.schema';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  @Post('register')
  async register(@Body() body: User) {
    return this.userService.createUser(body);
  }

  @Post('login')
  async login(@Body() body: { phone: string; password: string }) {
    console.log(body);
    const user = await this.authService.validateUser(body.phone, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async updateAccount(@Req() req, @Body() updateData: Partial<User>) {
    return this.userService.updateUser(req.user.userId, updateData);
  }
}
