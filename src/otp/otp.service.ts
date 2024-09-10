// src/otp/otp.service.ts

import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OTP, OTPDocument } from './otp.schema';
import { v4 as uuidv4 } from 'uuid'; // For generating unique OTP

@Injectable()
export class OTPService {
  private twilioClient: twilio.Twilio;

  constructor(@InjectModel(OTP.name) private otpModel: Model<OTPDocument>) {
    this.twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendOTP(phoneNumber: string): Promise<string> {
    const otp = uuidv4().slice(0, 6); // Generate a 6-digit OTP
    await this.twilioClient.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    // Save OTP to the database with an expiration time
    const otpEntry = new this.otpModel({
      phoneNumber,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60000), // OTP valid for 10 minutes
    });
    await otpEntry.save();

    return otp;
  }

  async verifyOTP(phoneNumber: string, otp: string): Promise<boolean> {
    const otpEntry = await this.otpModel.findOne({ phoneNumber, otp }).exec();
    if (!otpEntry || otpEntry.expiresAt < new Date()) {
      return false; // OTP is invalid or expired
    }
    return true;
  }
}
