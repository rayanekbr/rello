import { Controller, Post, Put, Get,Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtauth.guard';
import { BoardsService } from './boards.service';
import { UpdateBoardDto } from './dto/update-board.dto';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardMetadataDto } from './dto/update-boardmetadata.dto';


@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Put(':boardId/metadata')
  async updateBoardMetadata(
    @Param('boardId') boardId: string,
    @Body() updateBoardMetadataDto: UpdateBoardMetadataDto,
  ) {
    return this.boardsService.updateBoardMetadata(boardId, updateBoardMetadataDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createBoard(@Request() req, @Body() createBoardDto: CreateBoardDto) {
    const userId = req.user.userId; // Extract user ID from JWT
    const { name, members } = createBoardDto; // Destructure name and members
    return this.boardsService.createBoard(name, userId, members);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getBoards(@Request() req) {
    const userId = req.user.userId; // Extract user ID from JWT
    return this.boardsService.findBoardsByOwner(userId);
  }
  @Put(':id')
  async updateBoard(
    @Param('id') boardId: string,
    @Request() req,
    @Body() updates: UpdateBoardDto,
  ) {
    const userId = req.user.userId;
    return this.boardsService.updateBoard(boardId, userId, updates);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteBoard(@Param('id') boardId: string, @Request() req) {
    const userId = req.user.userId; // Extract user ID from JWT
    return this.boardsService.deleteBoard(boardId, userId);
  }
}
