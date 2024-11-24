import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';



@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService, // Inject JwtService
      ) {}

  async register(name: string, email: string, password: string) {
    console.log('AuthService - Register:', { name, email });
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({ name, email, password: hashedPassword });
  }
  
  async login(email: string, password: string): Promise<{ accessToken: string }> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
  
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');
  
    const payload = { sub: user._id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
  
    return { accessToken };
  }
  

}
