import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card, CardSchema } from './schemas/card.schema';
import { ListsModule } from 'src/list/lists.module';
import { List, ListSchema } from 'src/list/schema/lists.schema';

@Module({
  imports: [ListsModule, MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }, { name: List.name, schema: ListSchema }]),],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule { }