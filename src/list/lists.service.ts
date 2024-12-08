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
  ) {}

  async createList(
    name: string,
    boardId: string,
    userId: string,
  ): Promise<List> {
    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const isMember =
      board.owner.toString() === userId ||
      board.members.some((member) => member.toString() === userId);
    if (!isMember) {
      throw new ForbiddenException(
        'You do not have permission to create a list on this board',
      );
    }

    const newList = new this.listModel({
      name,
      boardId,
    });

    const savedList = await newList.save();

    board.lists.push(savedList._id as mongoose.Types.ObjectId);
    await board.save();

    return savedList;
  }

  async getListsByBoard(boardId: string): Promise<List[]> {
    return this.listModel.find({ boardId }).exec();
  }
}
