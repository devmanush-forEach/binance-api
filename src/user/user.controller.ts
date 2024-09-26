// src/user/user.controller.ts
import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/payment-methods')
  async getUsersPMethods(@Param('userId') userId: string): Promise<any> {
    return this.userService.getAllAddedPaymentMethods(userId);
  }

  @Get(':email')
  async getUser(@Param('email') email: string): Promise<User> {
    return this.userService.findUserByEmail(email);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }
}
