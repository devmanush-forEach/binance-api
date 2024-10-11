import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransactionMethods } from 'src/transactions-methods/transaction-methods.schema';
import { User } from 'src/user/user.schema';

export type PaymentServicesDocument = PaymentServices & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class PaymentServices {
  @Prop({ required: true })
  holderName: string;

  @Prop({ required: true, enum: ['BANK', 'UPI'] })
  paymentType: string;

  @Prop({
    required: function () {
      return this.paymentType === 'BANK';
    },
  })
  bankName: string;

  @Prop({
    required: function () {
      return this.paymentType === 'BANK';
    },
  })
  ifsccode: string;

  @Prop({
    required: function () {
      return this.paymentType === 'BANK';
    },
    unique: true,
  })
  accountNumber: string;

  @Prop({
    required: function () {
      return this.paymentType === 'UPI';
    },
    unique: true,
  })
  upiId: string;

  @Prop({ default: '' })
  remark: string;

  @Prop({ type: Types.ObjectId, ref: TransactionMethods.name, required: true })
  transactionMethodId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const PaymentServicesSchema =
  SchemaFactory.createForClass(PaymentServices);
