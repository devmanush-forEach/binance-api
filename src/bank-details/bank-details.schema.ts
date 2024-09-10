import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BankDetailsDocument = BankDetails & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class BankDetails {
  @Prop({ required: true })
  bankName: string;

  @Prop({ required: true })
  holderName: string;

  @Prop({ required: true })
  ifsccode: string;

  @Prop({ required: true, unique: true })
  accountNumber: string;

  @Prop({ default: '' })
  remark: string;
}

export const BankDetailsSchema = SchemaFactory.createForClass(BankDetails);
