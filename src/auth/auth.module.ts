import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
@Module({
  imports: [
    UsersModule, // Import UsersModule
    PassportModule, // Optional for JWT-based authentication
    JwtModule.register({
      secret: 'your-secret-key', // Use environment variables for production
      signOptions: { expiresIn: '1h' },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Register JwtStrategy here
  exports: [AuthService],
})
export class AuthModule {}
