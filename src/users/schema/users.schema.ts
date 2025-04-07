/* eslint-disable prettier/prettier */
// src/users/schemas/user.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'member' })
  role: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], default: [] })
  members: mongoose.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
