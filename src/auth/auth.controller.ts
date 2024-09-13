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
  Get,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.schema';
import { Request, Response } from 'express';


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  @Get('jwt')
  async validateJwt(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['access_token'];

    if (!token) {
      throw new HttpException('Token not found in cookies', HttpStatus.BAD_REQUEST);
    }

    try {
      const { email, userId } = await this.authService.validateUserByToken(token);

      const { password, role, createdAt, updatedAt, ...user } = await this.userService.findUserById(userId);

      return res.status(HttpStatus.OK).json({
        message: 'Token is valid',
        user,
      });
    } catch (error) {
      throw new HttpException('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }
  }


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
