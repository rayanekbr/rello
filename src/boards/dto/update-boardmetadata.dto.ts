import { IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateBoardMetadataDto {
  @IsOptional()
  @IsString()
  description?: string; // The description of the board

  @IsOptional()
  @IsEnum(['Private', 'Public'])
  visibility?: string; // Visibility can be 'Private' or 'Public'

  @IsOptional()
  @IsString()
  background?: string; // Background color or image URL
}
