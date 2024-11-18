import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NetworkDocument = Network & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class Network {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  code: string;

  @Prop({ required: false, type: String })
  networkProtocol: string;

  @Prop({ required: false })
  confirmationsRequired: number;

  @Prop({ required: true })
  blockConfirmations: number;

  @Prop({ required: false })
  averageConfirmationTime: number;

  @Prop({
    type: {
      transferSpeed: { type: Number, required: false },
      confirmationSpeed: { type: Number, required: false },
    },
    required: false,
  })
  deposit: {
    transferSpeed: number;
    confirmationSpeed: number;
  };

  @Prop({
    type: {
      speeds: { type: Number, required: true },
    },
    required: false,
  })
  withdraw: {
    speeds: number;
  };
  @Prop({ default: true })
  isActive: boolean;
}

export const NetworkSchema = SchemaFactory.createForClass(Network);
