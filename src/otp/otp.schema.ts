import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OTPDocument = OTP & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class OTP {
  @Prop({
    validate: {
      validator: function (this: OTP, value: string) {
        return !!value || !!this.email;
      },
      message: 'Either phoneNumber or email must be provided.',
    },
  })
  phoneNumber?: string;

  @Prop({
    validate: {
      validator: function (this: OTP, value: string) {
        return !!value || !!this.phoneNumber;
      },
      message: 'Either phoneNumber or email must be provided.',
    },
  })
  email?: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  expiresAt: Date;
}

export const OTPSchema = SchemaFactory.createForClass(OTP);
