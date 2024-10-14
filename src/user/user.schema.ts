import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Country } from 'src/country/country.schema';
import { UserBadge } from './user-badge/user-badge.schema';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, default: true })
  active: boolean;

  @Prop({ required: true, default: false })
  phoneVerified: boolean;

  @Prop({ required: true, default: false })
  emailVerified: boolean;

  @Prop({ type: Types.ObjectId, ref: Country.name, required: true })
  country: Types.ObjectId;

  @Prop([{ type: Types.ObjectId, ref: UserBadge.name, required: false }])
  badges: Types.ObjectId[];

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
