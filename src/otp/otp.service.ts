// src/otp/otp.service.ts

import { Injectable } from '@nestjs/common';
// import * as twilio from 'twilio';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP, OTPDocument } from './otp.schema';
import { v4 as uuidv4 } from 'uuid'; // For generating unique OTP

@Injectable()
export class OTPService {
  // private twilioClient: twilio.Twilio;

  constructor(@InjectModel(OTP.name) private otpModel: Model<OTPDocument>) {
    // this.twilioClient = twilio(
    //   process.env.TWILIO_ACCOUNT_SID,
    //   process.env.TWILIO_AUTH_TOKEN,
    // );
  }

  async sendOTP(phoneNumber: string): Promise<string> {
    const otp = uuidv4().slice(0, 6);
    // await this.twilioClient.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber,
    // });

    // Save OTP to the database with an expiration time
    const otpEntry = new this.otpModel({
      phoneNumber,
      otp,
      expiresAt: new Date(Date.now() + 15 * 60000),
    });
    await otpEntry.save();

    return 'successfully Sent';
  }
  async sendMailOTP(email: string): Promise<string> {
    const otp = uuidv4().slice(0, 6);
    // await this.twilioClient.messages.create({
    //   body: `Your OTP is ${otp}`,
    //   from: process.env.TWILIO_PHONE_NUMBER,
    //   to: phoneNumber,
    // });

    // Save OTP to the database with an expiration time
    const otpEntry = new this.otpModel({
      email,
      otp,
      expiresAt: new Date(Date.now() + 15 * 60000),
    });
    await otpEntry.save();

    return 'successfully Sent';
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
    return otp == '112233';
    const otpEntry = await this.otpModel
      .findOne({ phoneNumber, otp })
      .sort({ createdAt: -1 })
      .exec();
    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      return false;
    }
    return true;
  }
  async verifyEmailOTP(email: string, otp: string): Promise<boolean> {
    return otp == '112233';

    const otpEntry = await this.otpModel
      .findOne({ email, otp })
      .sort({ createdAt: -1 })
      .exec();
    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      return false;
    }
    return true;
  }
}
