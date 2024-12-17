import { Controller, Post, Get, Body, Headers, Param } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly authSrevice: AuthService,
  ) {}

  @Post()
  async createBoard(
    @Headers('Authorization') auth: string,
    @Body() createBoardDto: CreateBoardDto,
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authSrevice.decodeToken(token);
    const userId = userData.sub;

    return this.boardsService.createBoard(createBoardDto, userId);
  }

  @Get()
  async getBoards(@Headers('Authorization') auth: string) {
    const token = auth.split(' ')[1];
    const userData = await this.authSrevice.decodeToken(token);
    const ownerId = userData.sub;

    return this.boardsService.findBoardsByOwner(ownerId);
  }
  

}
