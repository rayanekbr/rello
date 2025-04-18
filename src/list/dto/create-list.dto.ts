import { IsString } from 'class-validator';

export class CreateListDto {
  @IsString()
  name: string;

  @IsString()
  boardId: string;
}
