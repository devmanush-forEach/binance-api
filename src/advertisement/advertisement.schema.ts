import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Coin } from 'src/coin/coin.schema';
import { Country } from 'src/country/country.schema';
import { Currency } from 'src/currency/currency.schema';
import { TransactionMethods } from 'src/transactions-methods/transaction-methods.schema';
import { PaymentServices } from 'src/user/payment-services/payment-services.schema';
import { User } from 'src/user/user.schema';

export enum AdType {
  BUY = 'buy',
  SELL = 'sell',
}

export enum StatusType {
  BUY = 'online',
  SELL = 'offline',
}

@Schema({ timestamps: true })
export class Advertisement extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;

  @Prop({ enum: AdType, required: true })
  adType: AdType;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: Boolean, required: true })
  isOnline: boolean;

  @Prop({ type: Boolean, required: true })
  isDynamicPrice: boolean;

  @Prop({ type: Boolean, required: true })
  isFixedPrice: boolean;

  @Prop({ type: Number, required: false })
  transactionPrice: number;

  @Prop({ type: Number, required: false })
  pricePercent: number;

  @Prop({ type: Number, required: true })
  transactionLimitMin: number;

  @Prop({ type: Number, required: true })
  transactionLimitMax: number;

  @Prop({ type: Number, required: true })
  transactionTimeLimit: number;

  @Prop({ type: Types.ObjectId, ref: Currency.name, required: true })
  currency: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Country.name, required: true })
  regions: Types.ObjectId;

  @Prop({ type: String })
  transactionTitle: string;

  @Prop({ type: String })
  transactionRemark: string;

  @Prop({
    type: [Types.ObjectId],
    ref: TransactionMethods.name,
    required: function () {
      return this.adType === 'buy';
    },
  })
  transactionMethods: Types.ObjectId[];

  @Prop({
    type: [Types.ObjectId],
    ref: PaymentServices.name,
    required: function () {
      return this.adType === 'sell';
    },
  })
  paymentMethods: Types.ObjectId[];

  @Prop({ type: Types.ObjectId, ref: Coin.name, required: true })
  coinId: Types.ObjectId;

  @Prop({
    type: Object,
    default: {
      registeredDaysAgo: 0,
      holdingsMoreThan: 0,
    },
  })
  counterPartyConditions: {
    registeredDaysAgo: number;
    holdingsMoreThan: number;
  };
}

export const AdvertisementSchema = SchemaFactory.createForClass(Advertisement);
