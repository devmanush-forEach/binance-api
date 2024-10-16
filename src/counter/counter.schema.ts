import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CounterDocument = Counter & Document;

@Schema({
  versionKey: false,
  timestamps: true,
})
export class Counter {
  @Prop({ required: true })
  _id: string;

  @Prop({ required: true })
  orderNo: number;

  @Prop({ required: false })
  userNo: number;

  @Prop({ required: false })
  adNo: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);
