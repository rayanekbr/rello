import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { Card, CardSchema } from './schemas/card.schema';
import { List, ListSchema } from '../list/schema/lists.schema';
import { Board, BoardSchema } from '../boards/schemas/board.schema';
import { BoardsModule } from '../boards/boards.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Card.name, schema: CardSchema },
      { name: List.name, schema: ListSchema },
      { name: Board.name, schema: BoardSchema }
    ]),
    BoardsModule,
    AuthModule
  ],
  controllers: [CardsController],
  providers: [CardsService],
})
export class CardsModule {}