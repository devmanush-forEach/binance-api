// src/user/user.controller.ts
import { Controller, Get, Param, Put, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { JwtAuthGuard } from 'src/middleware/auth.middleware';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get(':email')
  async getUser(@Param('email') email: string): Promise<User> {
    return this.userService.findUserByEmail(email);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/paymentMethods')
  async getUsersPMethods(@Param('userId') userId: string): Promise<any> {
    return this.userService.getAllAddedPaymentMethods(userId);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(id, updateData);
  }
}
