import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: mongoose.Schema.Types.ObjectId;

  @Prop({ default: 'Private' })
  visibility: string;

  @Prop({ default: '' })
  background: string;
  
  @Prop({ type: Date, default: null })
  lastViewed: Date;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
