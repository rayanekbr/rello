import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post() // Sub-route
    async register(@Body() body: { name: string; email: string; password: string }) {
      console.log('Register endpoint hit', body); // Debugging log
      const { name, email, password } = body;
      return this.authService.register(name, email, password);
    }
    
    
}
