import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Card } from './schemas/card.schema';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { List } from 'src/list/schema/lists.schema';
import { Board } from 'src/boards/schemas/board.schema';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<Card>,
    @InjectModel(List.name) private listModel: Model<List>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
  ) { }

  async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {

    const list = await this.listModel
      .findById(createCardDto.listId, { _id: 1, boardId: 1 })
      .lean()
      .exec();
    if (!list) {
      throw new NotFoundException('List not found');
    }

    const newCard = new this.cardModel({
      title: createCardDto.title,
      listId: list._id,
      boardId: list.boardId,
      userId: userId,
      dueComplete: createCardDto.dueComplete ?? false,
    });

    return newCard.save();
  }

  async findAll(userId: string): Promise<Card[]> {
    return this.cardModel.find({ userId }).exec();
  }

  async findOne(id: string, userId: string): Promise<Card> {
    const card = await this.cardModel
      .findById(id)
      .populate('listId')
      .populate('boardId')
      .exec();
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    const list = await this.listModel.findById(card.listId);
    const board = await this.boardModel.findById(list.boardId);

    if (board.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to access this card');
    }

    return card;
  }

  async updateCard(cardId: string, updateCardDto: UpdateCardDto, userId: string): Promise<Card> {
    const card = await this.cardModel.findById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    const list = await this.listModel.findById(card.listId);
    const board = await this.boardModel.findById(list.boardId);

    if (board.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to update this card');
    }

    if (updateCardDto.listId) {
      const newList = await this.listModel
        .findById(updateCardDto.listId, { _id: 1, boardId: 1 })
        .lean()
        .exec();

      if (!newList) {
        throw new NotFoundException('Destination list not found');
      }

      card.listId = new mongoose.Types.ObjectId(newList._id.toString());
      card.boardId = new mongoose.Types.ObjectId(newList.boardId.toString());
    }

    if (updateCardDto.title) {
      card.title = updateCardDto.title;
    }

    if (updateCardDto.content) {
      card.content = updateCardDto.content;
    }

    if (updateCardDto.labels) {
      card.labels = updateCardDto.labels;
    }

    if (updateCardDto.dueComplete !== undefined) {
      card.dueComplete = updateCardDto.dueComplete;
    }

    if (updateCardDto.startDate) {
      card.startDate = new Date(updateCardDto.startDate);
    }

    if (updateCardDto.dueDate) {
      card.dueDate = new Date(updateCardDto.dueDate);
    }

    if (updateCardDto.reminder) {
      card.reminder = updateCardDto.reminder;
    }

    return card.save();
  }

  async remove(id: string, userId: string): Promise<void> {
    const card = await this.cardModel.findById(id);
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    const list = await this.listModel.findById(card.listId);
    const board = await this.boardModel.findById(list.boardId);

    if (board.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to delete this card');
    }

    await this.cardModel.findByIdAndDelete(id).exec();
  }
  async addLabelToCard(cardId: string, labelId: string, userId: string): Promise<Card> {
    const card = await this.findOne(cardId, userId);
    if (!card) {
      throw new NotFoundException('Card not found or access denied');
    }

    if (!card.labels.includes(labelId)) {
      card.labels.push(labelId);
    }

    return card.save();
  }

  async removeLabelFromCard(cardId: string, labelId: string, userId: string): Promise<Card> {
    const card = await this.findOne(cardId, userId);
    if (!card) {
      throw new NotFoundException('Card not found or access denied');
    }

    card.labels = card.labels.filter((id) => id !== labelId);
    return card.save();
  }

  async moveCard(cardId: string, targetListId: string, position: number, userId: string): Promise<Card> {
    // Find the card and verify it exists
    const card = await this.cardModel.findById(cardId);
    if (!card) {
      throw new NotFoundException('Card not found');
    }

    // Find the target list and verify it exists
    const targetList = await this.listModel.findById(targetListId);
    if (!targetList) {
      throw new NotFoundException('Target list not found');
    }

    // Verify user has permission by checking board ownership
    const board = await this.boardModel.findById(targetList.boardId);
    if (board.userId.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to move this card');
    }

    // Update card's list and board IDs using string conversion
    card.listId = new mongoose.Types.ObjectId(targetList._id.toString());
    card.boardId = new mongoose.Types.ObjectId(targetList.boardId.toString());

    // Save the updated card
    return card.save();
  }
}
