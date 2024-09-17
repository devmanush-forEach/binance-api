import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { WalletValue, WalletValueSchema } from './crypto/crypto.schema';

export type WalletDocument = Wallet & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Wallet {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ type: [WalletValueSchema], default: [] })
  walletValues: WalletValue[];
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
