import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LabelDocument = Label & Document;

@Schema({ timestamps: true })
export class Label {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    color: string;

    @Prop({ required: true })
    boardId: string;
}

export const LabelSchema = SchemaFactory.createForClass(Label); 