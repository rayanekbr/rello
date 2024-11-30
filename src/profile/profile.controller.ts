import { Controller, Get, UseGuards, Request, Headers } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwtauth.guard'; // Adjust the path if necessary
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';



@Controller('profile') // Base route: /profile

export class ProfileController {
  
  constructor(private readonly usersService: UsersService,
    private readonly authService:  AuthService // Adjust the path if necessary
  ) {
   
  }


  @Get()
  async getProfile(@Headers("authorization") auth :string){
    // Extract user ID from the JWT token
    
    const token = auth.split(' ')[1];
    const userData = this.authService.decodeToken(token);
    const {sub : userid, email: usersemail} = userData;  // Extract user ID and email from the JWT payload
  
    console.log(userData);
    // Fetch user from the database using UsersService
    //const user = await this.usersService.findById(id);

    // If the user is not found, throw an error
  }
}
