import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/users.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    

    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    // Create a new user
    async create(userDto: { name: string; email: string; password: string }): Promise<User> {
      const { name, email, password } = userDto;
  
      // Check if the user already exists
      const existingUser = await this.userModel.findOne({ email }).exec();
      if (existingUser) {
        throw new Error('User with this email already exists');
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user
      const newUser = new this.userModel({
        name,
        email,
        password: hashedPassword,
      });
  
      return newUser.save(); // Save to MongoDB
    }
  
    // Find a user by email
    async findByEmail(email: string): Promise<User | null> {
      return this.userModel.findOne({ email }).exec();
    }
}
