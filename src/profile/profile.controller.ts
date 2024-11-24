import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtauth.guard'; // Adjust the path if necessary

@Controller('profile') // Base route: /profile
export class ProfileController {
  @UseGuards(JwtAuthGuard) // Protect this route
  @Get()
  getProfile(@Request() req) {

    // Return authenticated user's details
    return req.user;
  }
}
