
import {
    Injectable,
    NotFoundException,
    ConflictException,
    ForbiddenException,
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/mongoose';
  import { Model } from 'mongoose';
  import { Member } from './schema/member.schema';
  import { User } from 'src/users/schema/users.schema';
  import { Board } from '../boards/schemas/board.schema';
  
  @Injectable()
  export class MemberService {
    constructor(
      @InjectModel(Member.name) private readonly memberModel: Model<Member>,
      @InjectModel(Board.name) private readonly boardModel: Model<Board>,
      @InjectModel(User.name) private readonly userModel: Model<User>,
    ) {}
  
    // Invite a member to a board
    async inviteMember(
      boardId: string,
      email: string,
      inviterId: string,
    ): Promise<Member> {
      const board = await this.boardModel.findById(boardId).populate('members');
      if (!board) {
        throw new NotFoundException('Board not found');
      }
  
      // Check if the inviter is authorized (owner or member)
      const isAuthorized =
        board.owner.toString() === inviterId ||
        board.members.some((member: any) => member.userId?.toString() === inviterId);
  
      if (!isAuthorized) {
        throw new ForbiddenException('You are not authorized to invite members to this board');
      }
  
      // Check if the email is already invited
      const existingMember = await this.memberModel.findOne({ boardId, email });
      if (existingMember) {
        throw new ConflictException('User is already invited or a member');
      }
  
      // Check if the email belongs to an existing user
      const user = await this.userModel.findOne({ email });
  
      let newMember: Member;
  
      if (user) {
        // If the user exists, add them as a member directly
        newMember = new this.memberModel({
          boardId,
          userId: user._id,
          email,
          status: 'accepted',
          acceptedAt: new Date(),
        });
  
        board.members.push(newMember._id);
        await board.save();
      } else {
        // If the user doesn't exist, create a pending invitation
        newMember = new this.memberModel({
          boardId,
          email,
          status: 'pending',
        });
  
        board.members.push(newMember._id);
        await board.save();
  
        // Mock email service
        this.sendInvitationEmail(email, boardId);
      }
  
      return newMember.save();
    }
  
    // Accept an invitation
    async acceptInvitation(invitationId: string, userId: string): Promise<Member> {
      const invitation = await this.memberModel.findById(invitationId);
      if (!invitation || invitation.status !== 'pending') {
        throw new NotFoundException('Invitation not found or already accepted');
      }
  
      invitation.status = 'accepted';
      invitation.userId = userId;
      invitation.acceptedAt = new Date();
      await invitation.save();
  
      return invitation;
    }
  
    // Fetch members of a board
    async getBoardMembers(boardId: string): Promise<Member[]> {
      return this.memberModel.find({ boardId }).populate('userId', 'name email').exec();
    }
  
    private async sendInvitationEmail(email: string, boardId: string): Promise<void> {
      console.log(`Email sent to ${email} for board ${boardId}`);
      // Implement email sending logic here
    }
  }
  