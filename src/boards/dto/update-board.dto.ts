import { IsOptional, IsString, IsArray } from 'class-validator';

export class UpdateBoardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  members: { userId: string, role: string }[];
}
