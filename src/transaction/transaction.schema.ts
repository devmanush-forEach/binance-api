// src/transactions/schemas/transaction.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Currency } from 'src/currency/currency.schema';
import { User } from 'src/user/user.schema';

export type TransactionDocument = Transaction & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Transaction {
  @Prop({ required: true, unique: true })
  transactionId: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: Currency.name, required: true })
  currency: Types.ObjectId;

  @Prop({ required: true, enum: ['credit', 'debit'] })
  transactionType: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
