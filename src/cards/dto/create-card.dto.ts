import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  listId: string;  // Use listId, not idList

  @IsString()
  @IsNotEmpty()
  boardId: string;
}
