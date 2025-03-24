import { CreateBoardDto } from './dto/create-board.dto';
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { Board } from './schemas/board.schema';
import { User } from 'src/users/schema/users.schema';
import { List } from 'src/list/schema/lists.schema';
import { Card } from 'src/cards/schemas/card.schema';
import { UpdateCardDto } from './dto/update-board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(List.name) private readonly listModel: Model<List>,
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,
  ) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    userId: string,
  ): Promise<Board> {
    const newBoard = new this.boardModel({
      ...createBoardDto,
      userId,
    });
    return newBoard.save();
  }

  async getBoards(userId: string): Promise<any[]> {
    try {
      const boards = await this.boardModel.find({ userId }).exec();

      const enhancedBoards = [];

      for (const board of boards) {
        const boardId = board._id;

        const lists = await this.listModel
          .find({
            boardId: boardId,
          })
          .exec();

        const cards = await this.cardModel
          .find({
            boardId: boardId,
          })
          .exec();

        enhancedBoards.push({
          _id: board._id,
          name: board.name,
          visibility: board.visibility,
          background: board.background,
          userId: board.userId,
          lists: lists,
          cards: cards,
        });
      }

      return enhancedBoards;
    } catch (error: any) {
      console.error(`Error fetching boards: ${error.message}`);
      throw new InternalServerErrorException('Error fetching boards data');
    }
  }

  async getBoardByName(boardName: string, userId: string): Promise<any> {
    try {
      const formattedBoardName = boardName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      const board = await this.boardModel.findOne({
        name: formattedBoardName,
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!board) {
        throw new NotFoundException(`Board with name "${boardName}" not found`);
      }

      const boardObjectId = board._id;

      const lists = await this.listModel
        .find({ boardId: boardObjectId })
        .exec();

      const cards = await this.cardModel
        .find({ boardId: boardObjectId })
        .exec();

      return {
        _id: board._id,
        name: board.name,
        visibility: board.visibility,
        background: board.background,
        userId: board.userId,
        lists: lists,
        cards: cards,
      };
    } catch (error: any) {
      console.error(`Error fetching board by name: ${error.message}`);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching board data');
    }
  }

  async getBoardById(boardId: string, userId: string): Promise<any> {
    try {
      const boardObjectId = new mongoose.Types.ObjectId(boardId);

      const board = await this.boardModel.findById(boardObjectId).exec();

      if (!board) {
        throw new NotFoundException(`Board with ID ${boardId} not found`);
      }

      let boardOwnerId: any = board.userId;

      if (boardOwnerId instanceof Types.ObjectId) {
        boardOwnerId = boardOwnerId.toString();
      }

      if (boardOwnerId && boardOwnerId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to access this board',
        );
      }

      // Fetch lists and cards
      const lists = await this.listModel
        .find({ boardId: boardObjectId })
        .exec();

      const cards = await this.cardModel
        .find({ boardId: boardObjectId })
        .exec();

      return {
        _id: board._id,
        name: board.name,
        visibility: board.visibility,
        background: board.background,
        userId: board.userId,
        lists: lists,
        cards: cards,
      };
    } catch (error: any) {
      console.error(`Error fetching board: ${error.message}`);
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error fetching board data');
    }
  }
}
