import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Member } from './schema/member.schema';
import { User } from 'src/users/schema/users.schema';
import { Board } from '../boards/schemas/board.schema';

@Injectable()
export class MemberService {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
    @InjectModel(Board.name) private readonly boardModel: Model<Board>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) { }

  // async inviteMember(
  //   boardId: string,
  //   email: string,
  //   inviterId: string,
  // ): Promise<Member> {
  //   const board = await this.validateBoardAndPermissions(boardId, inviterId);

  //   const existingMember = await this.memberModel.findOne({ boardId, email });
  //   if (existingMember) {
  //     throw new ConflictException(
  //       'This email has already been invited or is a member.',
  //     );
  //   }

  //   const user = await this.userModel.findOne({ email });
  //   const newMember = user
  //     ? await this.addExistingUserToBoard(board, user)
  //     : await this.createPendingInvitation(board, email);

  //   return newMember;
  // }

  async acceptInvitation(
    invitationId: string,
    userId: string,
  ): Promise<Member> {
    const invitation = await this.memberModel.findById(invitationId);
    if (!invitation || invitation.status !== 'pending') {
      throw new NotFoundException('Invalid or already accepted invitation.');
    }

    invitation.status = 'accepted';
    invitation.userId = new Types.ObjectId(userId);
    invitation.acceptedAt = new Date();

    await invitation.save();

    await this.addUserToBoard(invitation.boardId, invitation.userId, 'member');

    return invitation;
  }

  async getBoardMembers(boardId: string): Promise<Member[]> {
    const board = await this.boardModel.findById(boardId);
    if (!board) throw new NotFoundException('Board not found.');

    return this.memberModel.find({ boardId }).populate('userId', 'name email');
  }

  // ----------------- Private Helper Methods -----------------

  // private async validateBoardAndPermissions(
  //   boardId: string,
  //   inviterId: string,
  // ): Promise<Board> {
  //   const board = await this.boardModel.findById(boardId).populate('members');
  //   if (!board) throw new NotFoundException('Board not found.');

  //   const isAuthorized =
  //     board.owner.toString() === inviterId ||
  //     board.members.some(
  //       (member: any) => member.userId?.toString() === inviterId,
  //     );

  //   if (!isAuthorized) {
  //     throw new ForbiddenException(
  //       'You are not authorized to invite members to this board.',
  //     );
  //   }

  //   return board;
  // }

  private async addExistingUserToBoard(
    board: Board,
    user: User,
  ): Promise<Member> {
    const newMember = new this.memberModel({
      boardId: board._id,
      userId: user._id,
      email: user.email,
      status: 'accepted',
      acceptedAt: new Date(),
    });

    await newMember.save();
    await this.addUserToBoard(
      board._id as Types.ObjectId,
      user._id as Types.ObjectId,
      'member',
    );

    return newMember;
  }

  private async createPendingInvitation(
    board: Board,
    email: string,
  ): Promise<Member> {
    const newMember = new this.memberModel({
      boardId: board._id,
      email,
      status: 'pending',
      invitedAt: new Date(),
    });

    await newMember.save();
    await this.addUserToBoard(
      board._id as Types.ObjectId,
      newMember._id as Types.ObjectId,
      'pending',
    );

    this.sendInvitationEmail(email, board._id.toString());

    return newMember;
  }

  private async addUserToBoard(
    boardId: Types.ObjectId,
    userId: Types.ObjectId,
    role: 'member' | 'pending',
  ): Promise<void> {
    await this.boardModel.findByIdAndUpdate(boardId, {
      $push: { members: { userId, role } },
    });
  }

  private async sendInvitationEmail(
    email: string,
    boardId: string,
  ): Promise<void> {
    console.log(`Sending invitation to ${email} for board ID: ${boardId}`);
    // Implement actual email sending logic here
  }
}
