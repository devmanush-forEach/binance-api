// src/user/user.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './user.schema';
import { WalletService } from 'src/wallet/wallet.service';
import { UPIDetailsService } from 'src/upi-details/upi-details.service';
import { BankDetailsService } from 'src/bank-details/bank-details.service';
import { TransactionMethodsService } from 'src/transactions-methods/transaction-methods.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private walletService: WalletService,
    private readonly upiDetailsService: UPIDetailsService,
    private readonly bankDetailsService: BankDetailsService,
    private readonly transactionMethodsService: TransactionMethodsService,
  ) {}

  async createUser(user: CreateUserDto): Promise<User> {
    const { password } = user;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userBody: CreateUserDto = { ...user, password: hashedPassword };
    const newUser = new this.userModel(userBody);
    const userData = await newUser.save();
    const userId = userData._id;
    if (userId) {
      await this.walletService.createWallet(userId as string);
    }
    return userData;
  }

  async findUserByPhone(phone: string): Promise<User | undefined> {
    return this.userModel.findOne({ phone }).lean().exec();
  }

  async findAllUsers(
    filters: { name?: string; email?: string; phone?: string },
    page: number = 1,
    limit: number = 10,
  ): Promise<{ users: User[]; total: number }> {
    const { name, email, phone } = filters;
    const query = [];

    if (name) {
      query.push({ name: { $regex: new RegExp(name, 'i') } });
    }
    if (email) {
      query.push({ email: { $regex: new RegExp(email, 'i') } });
    }
    if (phone) {
      query.push({ phone: { $regex: new RegExp(phone, 'i') } });
    }

    const aggregationPipeline = [
      {
        $match: query.length > 0 ? { $and: query } : {},
      },
      {
        $facet: {
          users: [{ $skip: (page - 1) * limit }, { $limit: limit }],
          total: [{ $count: 'count' }],
        },
      },
    ];

    const result = await this.userModel.aggregate(aggregationPipeline).exec();
    const users = result[0].users;
    const total = result[0].total.length > 0 ? result[0].total[0].count : 0;

    return { users, total };
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

    const allMethods = { ...upiMethods, ...bankMethods };

    const paymentMethods = await this.transactionMethodsService.findAll();
    return paymentMethods?.map((pMethod: any) => {
      return {
        ...pMethod,
        list: allMethods[pMethod._id] || [],
      };
    });
  }

  async updateUser(
    userId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(userId, updateUserDto, {
      new: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
