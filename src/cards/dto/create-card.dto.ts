import { IsNotEmpty, IsOptional, IsString, IsArray, IsDateString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCardDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  listId: Types.ObjectId;

  @IsNotEmpty()
  boardId: Types.ObjectId;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  labels?: string[];
}
