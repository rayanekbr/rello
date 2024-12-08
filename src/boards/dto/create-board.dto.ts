import { IsString, IsOptional, IsArray } from 'class-validator';

export class CreateBoardDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsArray()
  members: string[];

  @IsOptional()
  @IsString()
  visibility?: string;

  @IsOptional()
  @IsString()
  background?: string;
}
