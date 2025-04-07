/* eslint-disable prettier/prettier */
import { IsEmail, IsOptional, MinLength, IsArray } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsOptional()
  @IsArray()
  members?: string[];
}
