import { IsString, IsNotEmpty, IsHexColor } from 'class-validator';

export class CreateLabelDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsHexColor()
    @IsNotEmpty()
    color: string;

    @IsString()
    @IsNotEmpty()
    boardId: string;
} 