import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from './schemas/board.schema';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { List, ListSchema } from 'src/list/schema/lists.schema';
import { Card, CardSchema } from 'src/cards/schemas/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Board.name, schema: BoardSchema }, { name: List.name, schema: ListSchema }, { name: Card.name, schema: CardSchema }]),
    AuthModule,
    UsersModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule { }
