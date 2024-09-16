import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransactionMethods } from 'src/transactions-methods/transaction-methods.schema';
import { User } from 'src/user/user.schema';

export type UPIDetailsDocument = UPIDetails & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class UPIDetails {
  @Prop({ required: true })
  holderName: string;

  @Prop({ required: true, unique: true })
  upiId: string;

  @Prop({ default: '' })
  remark: string;

  @Prop({ type: Types.ObjectId, ref: TransactionMethods.name, required: true })
  transactionMethodId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
}

export const UPIDetailsSchema = SchemaFactory.createForClass(UPIDetails);
