import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Board, BoardSchema } from '../boards/schemas/board.schema';
import { List, ListSchema } from './schema/lists.schema';
import { ListsService } from './lists.service';
import { ListsController } from './lists.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: List.name, schema: ListSchema },
      { name: Board.name, schema: BoardSchema },
    ]),
    AuthModule,
  ],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule { }
