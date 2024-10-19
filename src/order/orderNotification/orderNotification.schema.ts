import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema'; // Assuming you have a User schema
import { Order } from '../order.schema';

@Schema({ timestamps: true })
export class OrderNotification extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  reciever: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
  orderId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  orderNumber: number;

  @Prop({ type: [String], required: false })
  images: string[];

  @Prop({ type: Boolean, default: false })
  transactionCompleted: boolean;

  @Prop({ type: String, required: true })
  message: string;
}

export const OrderNotificationSchema =
  SchemaFactory.createForClass(OrderNotification);
