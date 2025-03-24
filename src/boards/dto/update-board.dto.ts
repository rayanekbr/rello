import { IsBoolean } from "class-validator";

import { IsMongoId, IsOptional, IsString } from "class-validator";

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsMongoId()
  listId?: string;

  @IsOptional()
  @IsBoolean()
  dueComplete?: boolean;
}