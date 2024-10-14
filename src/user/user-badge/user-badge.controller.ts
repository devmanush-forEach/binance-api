// src/user-badges/user-badge.controller.ts

import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserBadgeService } from './user-badge.service';
import { CreateUserBadgeDto } from './dto/user-badge.dto';
import { UserBadge } from './user-badge.schema';

@Controller('user-badges')
export class UserBadgeController {
  constructor(private readonly userBadgeService: UserBadgeService) {}

  @Post()
  async create(
    @Body() createUserBadgeDto: CreateUserBadgeDto,
  ): Promise<UserBadge> {
    return this.userBadgeService.create(createUserBadgeDto);
  }

  @Get()
  async findAll(): Promise<UserBadge[]> {
    return this.userBadgeService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserBadge> {
    return this.userBadgeService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.userBadgeService.delete(id);
  }
}
