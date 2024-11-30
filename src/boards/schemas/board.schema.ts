import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  owner: string; // User ID

  @Prop({ default: [] })
  members: { userId: string, role: string }[]; // Array of user IDs

  @Prop({ default: 'Private' })
  visibility: string; // 'Public' or 'Private'

  @Prop({ default: '' })
  description: string; // Short description of the board

  @Prop({ default: '' })
  background: string; // Background color/image (optional)

  @Prop({ default: [] })
  activity: { userId: string, action: string, timestamp: Date }[]; // Array to track actions on the board

  @Prop({ default: '' })
  shareableLink: string; // A unique link to share with others
}

export const BoardSchema = SchemaFactory.createForClass(Board);
