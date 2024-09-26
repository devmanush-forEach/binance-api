// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { UPIDetailsService } from 'src/upi-details/upi-details.service';
import { BankDetailsService } from 'src/bank-details/bank-details.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private walletService: WalletService,
    private readonly upiDetailsService: UPIDetailsService,
    private readonly bankDetailsService: BankDetailsService,
  ) {}

  async createUser(user: User): Promise<User> {
    const { password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userBody: User = { ...user, password: hashedPassword };
    const newUser = new this.userModel(userBody);
    const userData = await newUser.save();
    const userId = userData._id;
    if (userId) {
      await this.walletService.createWallet(userId as Types.ObjectId);
    }
    return userData;
  }

  async findUserByPhone(phone: string): Promise<User | undefined> {
    return this.userModel.findOne({ phone }).lean().exec();
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async findUserById(id: string): Promise<User | undefined> {
    return this.userModel.findById(id).lean().exec();
  }

  async getAllAddedPaymentMethods(userId: string) {
    const upiMethods = await this.upiDetailsService.findAllByUserId(userId);
    const bankMethods = await this.bankDetailsService.findAllByUserId(userId);
    return [...upiMethods, ...bankMethods];
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
