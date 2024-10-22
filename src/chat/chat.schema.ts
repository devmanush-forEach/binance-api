import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';
import { Order } from 'src/order/order.schema';
import { User } from 'src/user/user.schema';

@Schema()
export class Message extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  recipient: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: Order.name, required: true })
  orderId: Types.ObjectId;

  @Prop({ required: false })
  content?: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({
    enum: ['delivered', 'seen', 'pending', 'deleted'],
    default: 'pending',
  })
  status: 'delivered' | 'seen' | 'pending' | 'deleted';

  @Prop({ required: false })
  fileUrl?: string;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
