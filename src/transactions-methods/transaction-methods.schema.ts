import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionMethodsDocument = TransactionMethods & Document;

@Schema({
    timestamps: true,  // Automatically adds createdAt and updatedAt fields
    versionKey: false,
})
export class TransactionMethods {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    type: string;

    @Prop({ required: true })
    color: string;
}

export const TransactionMethodsSchema = SchemaFactory.createForClass(TransactionMethods);
