import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type UPIDetailsDocument = UPIDetails & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class UPIDetails {
  @Prop({ required: true })
  holderName: string;

  @Prop({ required: true, unique: true }) // Unique constraint for UPI IDs
  upiId: string;

  @Prop({ default: '' })
  remark: string;

  @Prop({ required: true })
  serviceName: string;

  @Prop({ type: String })
  usedId: string;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId;
}

export const UPIDetailsSchema = SchemaFactory.createForClass(UPIDetails);
