import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Member extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Board', required: true })
  boardId: mongoose.Types.ObjectId; // Reference to the Board schema

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false })
  userId?: mongoose.Types.ObjectId; // Registered user (null if invited via email)

  @Prop({ required: true })
  email: string; // Email address of the user

  @Prop({ default: 'pending' }) // 'pending', 'accepted'
  status: string; // Invitation status

  @Prop({ default: Date.now })
  invitedAt: Date; // When the invitation was sent

  @Prop({ type: Date, required: false })
  acceptedAt?: Date; // When the invitation was accepted
}

export const MemberSchema = SchemaFactory.createForClass(Member);
