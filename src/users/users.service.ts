/* eslint-disable prettier/prettier */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schema/users.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(userDto: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<User> {
    const { name, email, password, role } = userDto;

    const existingUser = await this.userModel.findOne({ email }).exec();
    if (existingUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
      role: role || 'member',
    });

    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async update(
    id: string,
    updateDto: Partial<{ name: string; email: string; password: string }>,
  ): Promise<User> {
    const user = await this.findById(id);

    if (updateDto.name) user.name = updateDto.name;
    if (updateDto.email) {
      const emailExists = await this.userModel
        .findOne({ email: updateDto.email })
        .exec();
      if (emailExists && emailExists.id !== id) {
        throw new HttpException('Email is already in use', HttpStatus.CONFLICT);
      }
      user.email = updateDto.email;
    }
    if (updateDto.password) {
      user.password = await bcrypt.hash(updateDto.password, 10);
    }

    return user.save();
  }

  async delete(id: string): Promise<{ message: string }> {
    const user = await this.findById(id);
    await user.deleteOne();
    return { message: `User with ID ${id} has been deleted` };
  }

  async validatePassword(
    plaintextPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plaintextPassword.trim(), hashedPassword);
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

}
