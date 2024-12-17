import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './schema/member.schema';
import { MemberService } from './member.service';
import { MemberController } from './member.controller';
import { Board, BoardSchema } from '../boards/schemas/board.schema';
import { User, UserSchema } from '../users/schema/users.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Board.name, schema: BoardSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [MemberController],
  providers: [MemberService],
  exports: [MemberService],
})
export class MemberModule {}
