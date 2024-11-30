import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { UpdateBoardMetadataDto } from './dto/update-boardmetadata.dto';


@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
  ) {}

  async updateBoardMetadata(boardId: string, updateBoardMetadataDto: UpdateBoardMetadataDto): Promise<Board> {
    const board = await this.boardModel.findById(boardId);

    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Update only the fields that are provided in the DTO
    Object.assign(board, updateBoardMetadataDto);

    return await board.save(); // Save the updated board
  }
  
  async createBoard(name: string, owner: string, members: string[]): Promise<Board> {
    const newBoard = new this.boardModel({ name, owner , members });
    return newBoard.save();
  }

  
  async findBoardsByOwner(ownerId: string): Promise<Board[]> {
    return this.boardModel.find({ owner: ownerId }).exec();
  }

  async updateBoard(
    boardId: string,
    userId: string,
    updates: { name?: string; members: { userId: string, role: string }[] },
  ): Promise<Board> {
    const board = await this.boardModel.findOne({ _id: boardId, owner: userId });
    if (!board) {
      throw new Error('Board not found or you do not have permission to update it');
    }
  
    // Apply updates
    if (updates.name) {
      board.name = updates.name;
    }
    if (updates.members) {
      board.members = updates.members;
    }
  
    return board.save(); // Save the updated board
  }
  async deleteBoard(boardId: string, userId: string): Promise<{ message: string }> {
    // Find the board
    const board = await this.boardModel.findById(boardId);

    // Handle board not found
    if (!board) {
      throw new NotFoundException('Board not found');
    }

    // Check if the user is the owner
    if (board.owner !== userId) {
      throw new ForbiddenException('You do not have permission to delete this board');
    }

    // Delete the board
    await this.boardModel.deleteOne({ _id: boardId });

    return { message: 'Board deleted successfully' };
  }
    
}
