import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Board } from '../boards/schemas/board.schema';
import { List } from './schema/lists.schema';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(List.name) private readonly listModel: Model<List>,
    @InjectModel(Board.name) private readonly boardModel: Model<Board>, // To validate board ownership or membership
  ) { }

  async createList(
    name: string,
    boardId: string,
    userId: string,
  ): Promise<List> {
    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new NotFoundException('Board not found');
    }


    const newList = new this.listModel({
      name,
      boardId,
      closed: false,
    });

    const savedList = await newList.save();

    await board.save();

    return savedList;
  }

  async getListsByBoard(boardId: string): Promise<List[]> {
    return this.listModel.find({ boardId }).exec();
  }
  // Add these methods to your ListsService

  async updateList(
    listId: string,
    updateData: { name: string },
    userId: string,
  ): Promise<List> {
    const list = await this.listModel.findById(listId);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    // Check if user has permission to update this list
    const board = await this.boardModel.findById(list.boardId);
    if (!board) {
      throw new NotFoundException('Board not found');
    }


    list.name = updateData.name;
    return list.save();
  }

  async deleteList(listId: string, userId: string): Promise<void> {
    const list = await this.listModel.findById(listId);
    if (!list) {
      throw new NotFoundException('List not found');
    }

    // Check if user has permission to delete this list
    const board = await this.boardModel.findById(list.boardId);
    if (!board) {
      throw new NotFoundException('Board not found');
    }


    await board.save();

    await this.listModel.findByIdAndDelete(listId);
  }
}
