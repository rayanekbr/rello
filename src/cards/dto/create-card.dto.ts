import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  listId: string;

  @IsOptional()
  dueComplete: boolean;
}
