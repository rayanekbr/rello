import { Controller, Get, Post, Body, Param, Delete, Put, NotFoundException, Headers } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('cards')
export class CardsController {
  constructor(
    private readonly cardsService: CardsService,
    private readonly authService: AuthService
  ) { }

  @Post()
  async create(
    @Body() createCardDto: CreateCardDto,
    @Headers('Authorization') auth: string
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    return this.cardsService.create(createCardDto, userId);
  }

  @Get()
  async findAll(@Headers('Authorization') auth: string) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    return this.cardsService.findAll(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Headers('Authorization') auth: string
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    return this.cardsService.findOne(id, userId);
  }

  @Put(':id')
  async update(
    @Param('id') cardId: string,
    @Body() updateCardDto: UpdateCardDto,
    @Headers('Authorization') auth: string
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    const card = await this.cardsService.findOne(cardId, userId);
    if (!card) {
      throw new NotFoundException('Card not found or you do not have access');
    }

    return this.cardsService.updateCard(cardId, updateCardDto, userId);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Headers('Authorization') auth: string
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    // Check if the card exists and user has access
    const card = await this.cardsService.findOne(id, userId);
    if (!card) {
      throw new NotFoundException('Card not found or you do not have access');
    }

    return this.cardsService.remove(id, userId);
  }

  @Put(':cardId/labels/:labelId')
  async addLabel(
    @Param('cardId') cardId: string,
    @Param('labelId') labelId: string,
    @Headers('Authorization') auth: string
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    return this.cardsService.addLabelToCard(cardId, labelId, userId);
  }

  @Delete(':cardId/labels/:labelId')
  async removeLabel(
    @Param('cardId') cardId: string,
    @Param('labelId') labelId: string,
    @Headers('Authorization') auth: string
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    return this.cardsService.removeLabelFromCard(cardId, labelId, userId);
  }

  @Put(':id/move')
  async moveCard(
    @Param('id') cardId: string,
    @Body() moveData: { targetListId: string; position: number },
    @Headers('Authorization') auth: string
  ) {
    const token = auth.split(' ')[1];
    const userData = await this.authService.decodeToken(token);
    const userId = userData.sub;

    return this.cardsService.moveCard(
      cardId,
      moveData.targetListId,
      moveData.position,
      userId
    );
  }
}