import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { OTPService } from './otp.service';
import { UserService } from 'src/user/user.service';

@Controller('otp')
export class OTPController {
  constructor(
    private readonly otpService: OTPService,
    private readonly userService: UserService,
  ) {}

  @Post('send/phone')
  async sendOTP(@Body('phoneNumber') phoneNumber: string): Promise<string> {
    return this.otpService.sendOTP(phoneNumber);
  }

  @Post('send/phone')
  async sendUserOTP(@Body('phoneNumber') phoneNumber: string): Promise<string> {
    return this.otpService.sendOTP(phoneNumber);
  }

  @Post('send/email')
  async sendMailOTP(@Body('email') email: string): Promise<string> {
    return this.otpService.sendMailOTP(email);
  }

  @Post('send/user-email')
  async sendUserMailOTP(@Body('email') email: string): Promise<string> {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new BadRequestException('No user with the entered email');
    }
    return this.otpService.sendMailOTP(email);
  }

  @Post('verify/phone')
  async verifyPhoneOTP(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ): Promise<boolean> {
    return this.otpService.verifyOTP(phoneNumber, otp);
  }
  @Post('verify/email')
  async verifyEmailOTP(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ): Promise<boolean> {
    return this.otpService.verifyEmailOTP(email, otp);
  }
}
