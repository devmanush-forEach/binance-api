// src/transactions/schemas/transaction.schema.ts

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type TransactionDocument = Transaction & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Transaction {
  @Prop({ required: true, unique: true }) // Unique constraint for transactionId
  transactionId: string; // Unique identifier for the transaction

  @Prop({ required: true })
  amount: number; // Amount of the transaction

  @Prop({ required: true, enum: ['credit', 'debit'] })
  transactionType: string; // Type of transaction: 'credit' or 'debit'

  @Prop({ required: true })
  description: string; // Description of the transaction

  @Prop({ type: Types.ObjectId, ref: User.name, required: true }) // Reference to the User schema
  user: Types.ObjectId;

  @Prop({ required: true })
  date: Date; // Date of the transaction

  @Prop({
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  status: string; // Status of the transaction: 'pending', 'completed', or 'failed'
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
