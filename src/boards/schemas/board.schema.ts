import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  owner: mongoose.Schema.Types.ObjectId; // The owner of the board

  @Prop({ default: [] })
  members: { userId: mongoose.Types.ObjectId; role: string }[];

  @Prop({ default: 'Private' })
  visibility: string;

  @Prop({ default: '' })
  background: string;

  @Prop({ default: [] })
  activity: { userId: string; action: string; timestamp: Date }[]; // Activity log

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'List' }] })
  lists: mongoose.Types.ObjectId[];

  @Prop({ default: '' })
  shareableLink: string;
}

export const BoardSchema = SchemaFactory.createForClass(Board);
