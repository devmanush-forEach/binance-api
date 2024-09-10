// src/otp/otp.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OTPService } from './otp.service';
import { OTPController } from './otp.controller';
import { OTP, OTPSchema } from './otp.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }])],
  controllers: [OTPController],
  providers: [OTPService],
})
export class OTPModule {}
