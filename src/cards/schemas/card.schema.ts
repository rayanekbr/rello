import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class Card extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'List', required: true })
  listId: Types.ObjectId;

  @Prop({ required: false })
  content: string;

  @Prop({ required: false })
  dueComplete: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Board', required: false })
  boardId: Types.ObjectId;

  @Prop({ type: [String], default: [] })
  labels: string[];

  @Prop({ type: Date, required: false })
  startDate: Date;

  @Prop({ type: Date, required: false })
  dueDate: Date;

  @Prop({ required: false })
  reminder: string;

  @Prop({ type: String, required: false, default: '' })
  background: string;
}

export const CardSchema = SchemaFactory.createForClass(Card);
