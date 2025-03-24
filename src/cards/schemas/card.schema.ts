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
  dueComplete: boolean;

  @Prop({ type: Types.ObjectId, ref: 'Board', required: false })
  boardId: Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
