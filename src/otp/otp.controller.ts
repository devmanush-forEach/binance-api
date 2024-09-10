import { Controller, Post, Body } from '@nestjs/common';
import { OTPService } from './otp.service';

@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post('send')
  async sendOTP(@Body('phoneNumber') phoneNumber: string): Promise<string> {
    return this.otpService.sendOTP(phoneNumber);
  }

  @Post('verify')
  async verifyOTP(
    @Body('phoneNumber') phoneNumber: string,
    @Body('otp') otp: string,
  ): Promise<boolean> {
    return this.otpService.verifyOTP(phoneNumber, otp);
  }
}
