// src/user/user.controller.ts
import { Controller, Get, Param, Put, Body, UseGuards, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { GetUsersDto } from './dto/user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('/payment-methods')
  @UseGuards(JwtAuthGuard)
  async getUsersPMethods(@Param('userId') userId: string): Promise<any> {
    return this.userService.getAllAddedPaymentMethods(userId);
  }

  @Get('/all')
  // @UseGuards(JwtAuthGuard)
  async getUsers(
    @Query() query: GetUsersDto
  ): Promise<{ users: User[]; total: number }> {
    const { name, email, phone, page = 1, limit = 10 } = query;
    const filters = { name, email, phone };
    return this.userService.findAllUsers(filters, +page, +limit);
  }

  @Get(':email')
  // @UseGuards(JwtAuthGuard)
  async getUser(@Param('email') email: string): Promise<User> {
    return this.userService.findUserByEmail(email);
  }

  @Put(':id')
  // @UseGuards(JwtAuthGuard)
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }
}
