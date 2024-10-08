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

  @Prop({ required: true, enum: ['ERC20', 'TRC20', 'BEP20', 'Others'] })
  networkProtocol: string;

  @Prop({ required: true })
  confirmationsRequired: number;

  @Prop({ required: true })
  icon: string;

  @Prop({ required: true })
  averageConfirmationTime: number;

  @Prop({
    type: {
      transferSpeed: { type: Number, required: true },
      confirmationSpeed: { type: Number, required: true },
    },
    required: true,
  })
  deposit: {
    transferSpeed: number;
    confirmationSpeed: number;
  };

  @Prop({
    type: {
      speeds: { type: Number, required: true },
    },
    required: true,
  })
  withdraw: {
    speeds: number;
  };
}

export const NetworkSchema = SchemaFactory.createForClass(Network);
