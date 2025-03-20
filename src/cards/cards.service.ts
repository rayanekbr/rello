import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from './schemas/card.schema';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { List } from 'src/list/schema/lists.schema';

@Injectable()
export class CardsService {
  constructor(@InjectModel(Card.name) private cardModel: Model<Card>, @InjectModel(List.name) private listModel: Model<List>) { }

  async create(createCardDto: CreateCardDto): Promise<Card> {
    const list = await this.listModel.findById(createCardDto.listId).exec(); // Fix here: use listId instead of idList
    if (!list) {
      throw new NotFoundException('List not found');
    }

    const newCard = new this.cardModel({
      title: createCardDto.title,  // Ensure you are using the correct name from DTO, e.g. title instead of name
      listId: list._id,
      boardId: list.boardId,  // Ensure list has the correct boardId
    });

    return newCard.save();
  }

  async findAll(): Promise<Card[]> {
    return this.cardModel.find().exec();
  }

  async findOne(id: string): Promise<Card> {
    const card = await this.cardModel.findById(id).populate('listId').populate('boardId').exec();
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return card;
  }

  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    const updatedCard = await this.cardModel.findByIdAndUpdate(id, updateCardDto, { new: true }).exec();
    if (!updatedCard) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
    return updatedCard;
  }

  async remove(id: string): Promise<void> {
    const result = await this.cardModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }
  }
}
