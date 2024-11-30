import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  name: string;

  @IsString()
  owner: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsArray()
  members: string[]; // Optional list of user IDs for board members
}
