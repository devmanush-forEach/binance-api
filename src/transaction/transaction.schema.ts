import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Network } from 'src/network/network.schema';
import { Coin } from 'src/coin/coin.schema';

export type TransactionDocument = Transaction & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Transaction {
  @Prop({ required: false, unique: true })
  transactionId: string;

  @Prop({ required: false })
  withdrawAddress: string;

  @Prop({ required: false })
  depositAddress: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ type: Types.ObjectId, ref: Coin.name, required: true })
  coin: Types.ObjectId;

  @Prop({ required: true, enum: ['credit', 'debit'] })
  transactionType: string;

  @Prop({ required: false })
  description: string;

  @Prop({
    required: true,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  })
  status: string;

  @Prop({ type: Types.ObjectId, ref: Network.name, required: true })
  network: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
