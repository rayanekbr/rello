import {
    Controller,
    Post,
    Param,
    Body,
    UseGuards,
    Get,
    Headers,
  } from '@nestjs/common';
  import { JwtAuthGuard } from '../auth/jwtauth.guard';
  import { MemberService } from './member.service';
  import { AuthService } from '../auth/auth.service';
  
  @Controller('members')
  export class MemberController {
    constructor(
      private readonly memberService: MemberService,
      private readonly authService: AuthService,
    ) {}
  
    @UseGuards(JwtAuthGuard)
    @Post(':boardId/invite')
    async inviteMember(
      @Headers('Authorization') auth: string,
      @Param('boardId') boardId: string,
      @Body('email') email: string,
    ) {
      const token = auth.split(' ')[1];
      const userData = await this.authService.decodeToken(token);
      const inviterId = userData.sub;
  
      return this.memberService.inviteMember(boardId, email, inviterId);
    }
  
    @Post(':invitationId/accept')
    async acceptInvitation(
      @Param('invitationId') invitationId: string,
      @Body('userId') userId: string,
    ) {
      return this.memberService.acceptInvitation(invitationId, userId);
    }
  
    @UseGuards(JwtAuthGuard)
    @Get(':boardId')
    async getBoardMembers(@Param('boardId') boardId: string) {
      return this.memberService.getBoardMembers(boardId);
    }
  }
  