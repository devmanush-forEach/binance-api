import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Coin } from 'src/coin/coin.schema';
import { Network } from 'src/network/network.schema';
import { User } from 'src/user/user.schema';

export type CoinWalletDocument = CoinWallet & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class CoinWallet {
  @Prop({ type: Types.ObjectId, ref: Coin.name, required: true })
  coinId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Network.name, required: true })
  networkId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  minDeposit: number;

  @Prop({ type: Number, required: true })
  minWithdrawal: number;

  @Prop({ type: String, required: true })
  walletAddress: string;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Boolean, default: false })
  isAssigned: boolean;

  @Prop({ type: Boolean, default: false })
  isGlobal: boolean;

  @Prop({ type: Types.ObjectId, ref: User.name, required: false })
  user: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const CoinWalletSchema = SchemaFactory.createForClass(CoinWallet);
