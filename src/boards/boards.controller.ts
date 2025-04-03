import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  Req,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly authService: AuthService,
  ) { }

  @Post()
  async createBoard(
    @Headers('Authorization') auth: string,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    console.log('userData:', userData);
    const userId = userData.sub;

    return this.boardsService.createBoard(createBoardDto, userId);
  }

  @Get()
  async getBoards(@Headers('Authorization') auth: string) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;
    return this.boardsService.getBoards(userId);
  }

  @Get('id/:id')
  async getBoardById(
    @Param('id') boardId: string,
    @Headers('Authorization') auth: string,
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    return this.boardsService.getBoardById(boardId, userId);
  }

  @Get('name/:boardName')
  async getBoardByName(
    @Param('boardName') boardName: string,
    @Headers('Authorization') auth: string,
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;
    const formattedBoardName = boardName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return this.boardsService.getBoardByName(formattedBoardName, userId);
  }

  @Put(':id')
  async updateBoard(
    @Param('id') boardId: string,
    @Headers('Authorization') auth: string,
    @Body() updateData: { background?: string }
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    return this.boardsService.updateBoard(boardId, userId, updateData);
  }
}
