import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Headers,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { ListsService } from './lists.service';
import { CreateListDto } from './dto/create-list.dto';
import { AuthService } from '../auth/auth.service';

@Controller('lists')
export class ListsController {
  constructor(
    private readonly listsService: ListsService,
    private readonly authService: AuthService,
  ) {}

  // Extract user ID from token in cookie or Authorization header
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
  async createList(
    @Req() req: Request,
    @Headers('Authorization') auth: string,
    @Body() createListDto: CreateListDto,
  ) {
    const userId = await this.extractUserId(req, auth);
    const { name, boardId } = createListDto;
    return this.listsService.createList(name, boardId, userId);
  }

  @Get(':boardId')
  async getListsByBoard(
    @Req() req: Request,
    @Headers('Authorization') auth: string,
    @Param('boardId') boardId: string,
  ) {
    const userId = await this.extractUserId(req, auth);
    
    // Optional: Add permission check here if you want to verify
    // that the user has access to this board's lists
    // This would require injecting the boardModel into this controller
    
    return this.listsService.getListsByBoard(boardId);
  }

  // Add other endpoints as needed (update list, delete list, etc.)
  @Put(':listId')
  async updateList(
    @Req() req: Request,
    @Headers('Authorization') auth: string,
    @Param('listId') listId: string,
    @Body() updateData: { name: string },
  ) {
    const userId = await this.extractUserId(req, auth);
    // Add implementation for updating a list
    // You'll need to add this method to your ListsService
    return this.listsService.updateList(listId, updateData, userId);
  }

  @Delete(':listId')
  async deleteList(
    @Req() req: Request,
    @Headers('Authorization') auth: string,
    @Param('listId') listId: string,
  ) {
    const userId = await this.extractUserId(req, auth);
    // Add implementation for deleting a list
    // You'll need to add this method to your ListsService
    return this.listsService.deleteList(listId, userId);
  }
}