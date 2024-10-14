// src/user-badges/user-badge.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserBadge, UserBadgeDocument } from './user-badge.schema';
import { CreateUserBadgeDto } from './dto/user-badge.dto';

@Injectable()
export class UserBadgeService {
  constructor(
    @InjectModel(UserBadge.name)
    private userBadgeModel: Model<UserBadgeDocument>,
  ) {}

  async create(createUserBadgeDto: CreateUserBadgeDto): Promise<UserBadge> {
    const createdBadge = new this.userBadgeModel(createUserBadgeDto);
    return createdBadge.save();
  }

  async findAll(): Promise<UserBadge[]> {
    return this.userBadgeModel.find().populate('user').exec();
  }

  async findOne(id: string): Promise<UserBadge> {
    const badge = await this.userBadgeModel
      .findById(id)
      .populate('user')
      .exec();
    if (!badge) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }
    return badge;
  }

  async delete(id: string): Promise<void> {
    const result = await this.userBadgeModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Badge with ID ${id} not found`);
    }
  }
}
