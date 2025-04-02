import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register-dto';
import { LoginDto } from './dto/login-dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const { name, email, password, role } = registerDto;

    const userRole = role || 'user';

    const user = await this.usersService.create({
      name,
      email,
      password,
      role: userRole,
    });

    return { name: user.name, email: user.email, role: user.role };
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

    const payload = { sub: user.id, email: user.email, role: user.role, name: user.name };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    };
  }

  async decodeToken(token: string): Promise<any> {
    try {
      console.log('Decoding token:', token);
      const decoded = this.jwtService.verify(token, {
        secret: 'B1JhfY7XzK8eXz5W2vQ1j6oA4u2PZ8eXp2wUj7vM4x3gG2m5vP6yX9o2G3tG9a',
      });
      console.log('Decoded token:', decoded);
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
