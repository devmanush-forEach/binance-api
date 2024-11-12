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
  Param,
  Patch,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.schema';
import { Request, response, Response } from 'express';
import {
  CreateTransactionPassword,
  CreateUserDto,
  UpdateUserDto,
  VerifyTransactionPassword,
} from 'src/user/dto/user.dto';
import { JwtAuthGuard } from './gaurds/jwt-auth.gaurd';
import { OTPService } from 'src/otp/otp.service';
import { WalletService } from 'src/wallet/wallet.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private otpService: OTPService,
    private walletService: WalletService,
  ) {}

  @Get('jwt')
  async validateJwt(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies['access_token'];

    if (!token) {
      throw new HttpException(
        'Token not found in cookies',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const { email, userId } =
        await this.authService.validateUserByToken(token);

      const { password, role, transactionPassword, ...user } =
        await this.userService.findUserById(userId);

      const isTransactionPassword = !!transactionPassword;
      const data = { ...user, isTransactionPassword };
      const walletBalance = await this.walletService.getWalletBalanceInUsd(
        //@ts-ignore
        data._id.toString(),
      );

      return res.status(HttpStatus.OK).json({
        message: 'Token is valid',
        user: data,
        walletBalanceInUsd: walletBalance,
      });
    } catch (error) {
      throw new HttpException(
        'Invalid or expired token',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    const emailOtp = body.emailOtp;
    delete body.emailOtp;
    const email = body.email;

    const otpVerified = await this.otpService.verifyEmailOTP(email, emailOtp);
    if (!otpVerified) {
      throw new BadRequestException('Entered Wrong OTP!');
    }

    return this.userService.createUser(body);
  }

  @Post('create-transaction-password')
  @UseGuards(JwtAuthGuard)
  async createTransactionPassword(
    @Param('userId') userId: string,
    @Body() body: CreateTransactionPassword,
  ) {
    const { email, otp } = body;

    const otpVerified = await this.otpService.verifyEmailOTP(email, otp);
    if (!otpVerified) {
      throw new BadRequestException('Entered Wrong OTP!');
    }

    return this.authService.setTransactionPassword(userId, body);
  }

  @Post('verify-transaction-password')
  @UseGuards(JwtAuthGuard)
  async verifyTransactionPassword(
    @Param('userId') userId: string,
    @Body() body: VerifyTransactionPassword,
  ) {
    return this.authService.verifyTransactionPassword(userId, body);
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
    const walletBalance = await this.walletService.getWalletBalanceInUsd(
      result.user._id,
    );
    return res
      .status(HttpStatus.OK)
      .json({ ...result, walletBalanceInUsd: walletBalance });
  }

  @Patch('update-login-pass')
  @UseGuards(JwtAuthGuard)
  async updateLoginPass(
    @Param('userId') userId: string,
    @Body() body: { currentPass: string; newPassword: string },
    @Res() res: Response,
  ) {
    const user = await this.authService.updateLoginPass(
      userId,
      body.currentPass,
      body.newPassword,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user._id;
    delete user.password;
    return res.status(HttpStatus.OK).json(user);
  }
  @Patch('reset-login-pass')
  async resetLoginPass(
    @Body() body: { email: string; otp: string; newPassword: string },
    @Res() res: Response,
  ) {
    const otpVerified = await this.otpService.verifyEmailOTP(
      body.email,
      body.otp,
    );
    if (!otpVerified) {
      throw new BadRequestException('Entered Wrong OTP!');
    }

    const user = await this.authService.resetLoginPass(
      body.email,
      body.newPassword,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    delete user._id;
    delete user.password;
    return res.status(HttpStatus.OK).json(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('update')
  async updateAccount(@Req() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(req.user.userId, updateUserDto);
  }
}
