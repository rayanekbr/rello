import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {

    constructor(private readonly jwtService: JwtService) {
        super();
      }
    
      async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.authorization?.split(' ')[1]; // Extract token
        console.log('JWT Token:', token);  // Log the token
    
        if (!token) {
          throw new UnauthorizedException('Token not found');
        }
        
        // Proceed with token validation
        try {
          const payload = await this.jwtService.verifyAsync(token);
          request.user = payload;
          return true;
        } catch (error) {
          throw new UnauthorizedException('Invalid token');
        }
      }

}
