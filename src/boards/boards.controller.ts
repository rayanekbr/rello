import { Controller, Post, Get, Put, Delete, Body, Param, Headers, Req, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('boards')
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
    private readonly authService: AuthService,
  ) { }

  // Updated to check both cookie and Authorization header
  private async extractUserId(req: Request, authHeader?: string): Promise<string> {
    // Try to get token from cookie first
    let token = req.cookies?.auth_token;

    // If no cookie, try Authorization header
    if (!token && authHeader) {
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      console.error("No token found in cookie or Authorization header");
      throw new UnauthorizedException("Not authenticated");
    }

    console.log("Token found:", token.substring(0, 15) + "...");

    try {
      const userData = await this.authService.decodeToken(token);
      if (!userData || !userData.sub) {
        console.error("Token decoding failed or missing user ID");
        throw new UnauthorizedException("Invalid token");
      }

      console.log("✅ Token decoded successfully:", userData);
      return userData.sub;
    } catch (error) {
      console.error("Error decoding token:", error);
      throw new UnauthorizedException("Invalid or expired token");
    }
  }

  @Post()
  async createBoard(@Req() req: Request, @Headers('Authorization') auth: string, @Body() createBoardDto: CreateBoardDto) {
    const userId = await this.extractUserId(req, auth);
    return this.boardsService.createBoard(createBoardDto, userId);
  }

  // Update other endpoints similarly
  @Get()
  async getBoards(@Req() req: Request, @Headers('Authorization') auth: string) {
    const ownerId = await this.extractUserId(req, auth);
    return this.boardsService.findBoardsByOwner(ownerId);
  }

  @Get(':boardId/details')
  async getBoardDetails(@Param('boardId') boardId: string, @Req() req: Request, @Headers('Authorization') auth: string) {
    const ownerId = await this.extractUserId(req, auth);
    return this.boardsService.getBoardDetails(boardId, ownerId);
  }


  @Get(':id')
  async getBoard(@Req() req: Request, @Param('id') id: string, @Headers('Authorization') auth: string) {
    const ownerId = await this.extractUserId(req, auth);
    return this.boardsService.getBoard(id, ownerId);
  }

  @Put(':id')
  async updateBoard(@Req() req: Request, @Param('id') id: string, @Headers('Authorization') auth: string, @Body() updateData: Partial<CreateBoardDto>) {
    const ownerId = await this.extractUserId(req, auth);
    return this.boardsService.updateBoard(id, updateData, ownerId);
  }

  @Delete(':id')
  async deleteBoard(@Req() req: Request, @Param('id') id: string, @Headers('Authorization') auth: string) {
    const ownerId = await this.extractUserId(req, auth);
    return this.boardsService.deleteBoard(id, ownerId);
  }
 
  @Post(':boardId/recently-viewed')
async markBoardAsRecentlyViewed(@Param('boardId') boardId: string) {
  try {
    const board = await this.boardsService.markBoardAsRecentlyViewed(boardId);
    return { message: 'Board marked as recently viewed', board };
  } catch (error) {
    console.error('Error marking board as recently viewed:', error);
    throw new NotFoundException('Board not found');
  }
}

  // New GET endpoint to fetch recently viewed boards for the user
  @Get(':boardId/recently-viewed')
  async getRecentlyViewedBoard(@Param('boardId') boardId: string, @Req() req: Request, @Headers('Authorization') auth: string) {
    try {
      const ownerId = await this.extractUserId(req, auth); // Extract userId from the token
  
      // Pass both boardId and ownerId to the service method
      const board = await this.boardsService.getBoard(boardId, ownerId);
  
      if (!board.lastViewed) {
        throw new NotFoundException('No recent view data for this board');
      }
  
      return {
        message: 'Board details with recently viewed timestamp',
        board,
      };
    } catch (error) {
      console.error('Error fetching recently viewed board:', error);
      throw new NotFoundException('Board not found');
    }
  }
  
}