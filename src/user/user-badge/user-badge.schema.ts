import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type UserBadgeDocument = UserBadge & Document;

@Schema({ timestamps: true, versionKey: false })
export class UserBadge {
  @Prop({ required: true, unique: true })
  badgeName: string;

  @Prop({ required: true })
  badgeIcon: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const UserBadgeSchema = SchemaFactory.createForClass(UserBadge);
