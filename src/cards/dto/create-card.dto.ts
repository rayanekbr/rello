import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  listId: string;

  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  dueComplete: boolean;

  @IsOptional()
  labels?: string[];

  @IsOptional()
  startDate?: string;

  @IsOptional()
  dueDate?: string;

  @IsString()
  @IsOptional()
  reminder?: string;
}
