import { CreateBoardDto } from './dto/create-board.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
  ) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<Board> {
    const newBoard = new this.boardModel({
      ...createBoardDto,
      owner: userId,
      members: [userId],
    });
    return newBoard.save();
  }

  async findBoardsByOwner(userId: string): Promise<Board[]> {
    return this.boardModel.find({ owner: userId }).exec();
  }
}
