// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(user: User): Promise<User> {
    console.log(user);
    const { password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userBody = { ...user, password: hashedPassword };
    console.log(userBody);
    const newUser = new this.userModel(userBody);
    return newUser.save();
  }

  async findUserByPhone(phone: string): Promise<User | undefined> {
    return this.userModel.findOne({ phone }).lean().exec();
  }
  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateData, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
