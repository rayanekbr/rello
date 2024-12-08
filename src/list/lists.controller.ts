import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtauth.guard';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { AuthService } from '../auth/auth.service';

@Controller('lists')
export class ListsController {
  constructor(
    private readonly listsService: ListsService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  async createList(
    @Headers('Authorization') auth: string,
    @Body() createListDto: CreateListDto,
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    const { name, boardId } = createListDto;
    return this.listsService.createList(name, boardId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':boardId')
  async getListsByBoard(@Param('boardId') boardId: string) {
    return this.listsService.getListsByBoard(boardId);
  }
}
