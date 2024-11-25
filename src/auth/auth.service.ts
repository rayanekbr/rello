/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

// Mock database or repository (replace with actual implementation)
const mockDatabase: Array<{
  id: number;
  name: string;
  email: string;
  password: string;
}> = [];
let userIdCounter = 1;

@Injectable()
export class AuthService {
  async register(name: string, email: string, password: string) {
    console.log('AuthService - Register:', { name, email });

    const existingUser = mockDatabase.find((user) => user.email === email);
    if (existingUser) {
      throw new Error('Email is already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: userIdCounter++,
      name,
      email,
      password: hashedPassword,
    };
    mockDatabase.push(newUser);

    console.log('New user registered:', newUser);

    return { id: newUser.id, name: newUser.name, email: newUser.email };
  }

  async login(email: string, password: string) {
    console.log('AuthService - Login:', { email });

    const user = mockDatabase.find((user) => user.email === email);
    if (!user) {
      throw new Error('User not found');
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new Error('Invalid password');
    }

    // Generate JWT token
    const payload = { sub: user.id, email: user.email };
    const token = jwt.sign(
      payload,
      'E_NYNT2EeLJ-7DzV7KEB3i4KZJV1oPSIdDemXH9TUWeJuYvUAWpCqj9zyZFleDPPfVddHEe9Fc6N0WPE12Oaqw',
      { expiresIn: '1h' },
    );

    return {
      user: { id: user.id, name: user.name, email: user.email },
      accessToken: token,
    };
  }
}
