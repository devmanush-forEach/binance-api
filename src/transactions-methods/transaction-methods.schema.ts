import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Currency } from 'src/currency/currency.schema';

export type TransactionMethodsDocument = TransactionMethods & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class TransactionMethods {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['BANK', 'UPI'] })
  type: string;

  @Prop({ required: true })
  color: string;

  @Prop([{ type: Types.ObjectId, ref: Currency.name, required: true }])
  supportedCurrencies: Types.ObjectId[];

  @Prop({ required: false, default: true })
  isUniversal: boolean;
}

export const TransactionMethodsSchema =
  SchemaFactory.createForClass(TransactionMethods);
