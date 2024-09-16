import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UpiDocument = Upi & Document;

@Schema({
    timestamps: true,
    versionKey: false,
})
export class Upi {

    @Prop({ required: true, unique: true })
    name: string;
}

export const UpiSchema = SchemaFactory.createForClass(Upi);
