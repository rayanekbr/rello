import { CreateBoardDto } from './dto/create-board.dto';
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Board } from './schemas/board.schema';
import { User } from 'src/users/schema/users.schema';
import { List } from 'src/list/schema/lists.schema';
import { Card } from 'src/cards/schemas/card.schema';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(List.name) private readonly listModel: Model<List>,
    @InjectModel(Card.name) private readonly cardModel: Model<Card>,

  ) { }

  // ✅ Create a new board
  async createBoard(createBoardDto: CreateBoardDto, userId: string): Promise<Board> {
    const newBoard = new this.boardModel({
      ...createBoardDto,
      owner: userId,
      members: [{ userId, role: 'admin' }], // ✅ Assign user as admin
    });
    return newBoard.save();
  }

  // ✅ Fetch all boards owned by a user
  async findBoardsByOwner(userId: string): Promise<Board[]> {
    return this.boardModel.find({ owner: userId }).exec();
  }

  // ✅ Fetch a single board by ID
  async getBoard(boardId: string, userId: string): Promise<Board> {
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    return board;
  }

  // ✅ Update a board (Only the owner should be allowed)
  async updateBoard(boardId: string, updateData: Partial<CreateBoardDto>, userId: string): Promise<Board> {
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // ✅ Only the owner can update
    if (board.owner.toString() !== userId) {
      throw new ForbiddenException('Only the owner can update this board');
    }

    Object.assign(board, updateData);
    return board.save();
  }

  // ✅ Delete a board (Only the owner should be allowed)
  async deleteBoard(boardId: string, userId: string): Promise<void> {
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // ✅ Only the owner can delete
    if (board.owner.toString() !== userId) {
      throw new ForbiddenException('Only the owner can delete this board');
    }

    await this.boardModel.deleteOne({ _id: boardId }).exec();
  }

  async getBoardDetails(boardId: string, userId: string): Promise<{ id: string; lists: List[]; cards: Card[] }> {
    // Fetch the board and check permissions
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    const lists = await this.listModel.find({ boardId }).exec();

    // Fetch cards belonging to the board
    // (Alternatively, you could fetch cards by listing the IDs of the lists.)
    const cards = await this.cardModel.find({ boardId }).exec();

    return {
      id: board._id.toString(),
      lists,
      cards,
    };
  }
  
 async markBoardAsRecentlyViewed(boardId: string): Promise<Board> {
  const boardObjectId =new Types.ObjectId(boardId);  // Ensure `boardId` is converted to ObjectId
  const board = await this.boardModel.findById(boardObjectId).exec();
  if (!board) {
    throw new NotFoundException('Board not found');
  }

  // Update the lastViewed field
  board.lastViewed = new Date(); // Set the lastViewed to the current date
  return board.save(); // Save the updated board
}
  async getRecentlyViewedBoard(boardId: string): Promise<Board> {
    const board = await this.boardModel.findById(boardId).exec();
    if (!board) {
      throw new NotFoundException('Board not found');
    }
    return board;
  }
}
