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
} from '@nestjs/common';
import { Request } from 'express';
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
    console.log('userData:', userData);
    const userId = userData.sub;

    const { name, boardId } = createListDto;
    return this.listsService.createList(name, boardId, userId);
  }

  @Get(':boardId')
  async getListsByBoard(
    @Headers('Authorization') auth: string,
    @Param('boardId') boardId: string,
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    console.log('userData:', userData);
    const userId = userData.sub;

    // Optional: Add permission check here if you want to verify
    // that the user has access to this board's lists
    // This would require injecting the boardModel into this controller

    return this.listsService.getListsByBoard(boardId);
  }

  // Add other endpoints as needed (update list, delete list, etc.)
  @Put(':listId')
  async updateList(
    @Headers('Authorization') auth: string,
    @Param('listId') listId: string,
    @Body() updateData: { name: string },
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    console.log('userData:', userData);
    const userId = userData.sub;
    // Add implementation for updating a list
    // You'll need to add this method to your ListsService
    return this.listsService.updateList(listId, updateData, userId);
  }

  @Delete(':listId')
  async deleteList(
    @Headers('Authorization') auth: string,
    @Param('listId') listId: string,
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    console.log('userData:', userData);
    const userId = userData.sub;

    // Add implementation for deleting a list
    // You'll need to add this method to your ListsService
    return this.listsService.deleteList(listId, userId);
  }
}
