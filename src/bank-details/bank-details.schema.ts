import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransactionMethods } from 'src/transactions-methods/transaction-methods.schema';
import { User } from 'src/user/user.schema';

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

  @Prop({ type: Types.ObjectId, ref: TransactionMethods.name, required: true })
  transactionMethodId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const BankDetailsSchema = SchemaFactory.createForClass(BankDetails);
