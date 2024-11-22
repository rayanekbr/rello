import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService) {}

  async register(name: string, email: string, password: string) {
    console.log('AuthService - Register:', { name, email });
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({ name, email, password: hashedPassword });
  }
    

}
