import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Currency } from 'src/currency/currency.schema';

@Schema({ timestamps: true })
export class Country extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  code: number;

  @Prop({ required: true })
  phoneCode: string;

  @Prop({ required: true })
  isoCode: string;

  @Prop({ type: Types.ObjectId, ref: Currency.name, required: true })
  currency: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export const CountrySchema = SchemaFactory.createForClass(Country);
