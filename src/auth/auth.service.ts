/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  generateJwtToken(payload: { userId: any; email: any; }) {
    throw new Error('Method not implemented.');
  }
  validateUser(loginDto: LoginDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;

    const user = await this.usersService.create({ name, email, password });

    return { id: user.id, name: user.name, email: user.email };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
    };


  }

  async decodeToken(token: string): Promise<any> {
    try {
      // Decode and verify the token
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,  // Ensure the correct secret key is used
      });
  
      return decoded;  // Return the decoded token payload if valid
    } catch (error) {
      // If token verification fails, throw Unauthorized exception
      throw new UnauthorizedException('Invalid token');
    }
  }
  
}
