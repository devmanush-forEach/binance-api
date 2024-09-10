import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OTPDocument = OTP & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class OTP {
  @Prop({ required: true })
  phoneNumber: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
