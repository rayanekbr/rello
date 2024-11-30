/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  UsersService: any;
  constructor( private readonly jwtService: JwtService,
    private readonly userService: UsersService,) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'B1JhfY7XzK8eXz5W2vQ1j6oA4u2PZ8eXp2wUj7vM4x3gG2m5vP6yX9o2G3tG9a', // Use environment variables in production
    });
  }

  async validate(payload: any) {
    const user = await this.UsersService.findById(payload.sub);  // `sub` is the standard claim for user ID in JWT
    if (!user) {
      throw new Error('User not found');
    }
    return { userId: user._id, email: user.email };  // Attach user info to the request
  }
  
}
