// src/user/user.controller.ts
import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  UseGuards,
  Query,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.schema';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { GetUsersDto, UpdateUserDto } from './dto/user.dto';
import { PaymentServicesService } from './payment-services/payment-services.service';
import {
  CreatePaymentServicesDto,
  UpdatePaymentServicesDto,
} from './payment-services/dto/payment-services.dto';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly paymentServicesService: PaymentServicesService,
  ) {}

  @Get('/payment-service')
  @UseGuards(JwtAuthGuard)
  findPaymentServices(@Param('userId') userId: string) {
    return this.paymentServicesService.findAllForUser(userId);
  }

  @Get('/payment-methods')
  @UseGuards(JwtAuthGuard)
  async getUsersPMethods(@Param('userId') userId: string): Promise<any> {
    return this.userService.getAllAddedPaymentMethods(userId);
  }

  @Get('/all')
  // @UseGuards(JwtAuthGuard)
  async getUsers(
    @Query() query: GetUsersDto,
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
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Post('payment-service')
  @UseGuards(JwtAuthGuard)
  createPaymentService(
    @Param('userId') userId: string,
    @Body() createPaymentServicesDto: CreatePaymentServicesDto,
  ) {
    createPaymentServicesDto.userId = new Types.ObjectId(userId);
    return this.paymentServicesService.create(createPaymentServicesDto);
  }

  // Route for updating a payment service for a user
  @Patch(':userId/payment-service/:paymentServiceId')
  updatePaymentService(
    @Param('userId') userId: string,
    @Param('paymentServiceId') paymentServiceId: string,
    @Body() updatePaymentServicesDto: UpdatePaymentServicesDto,
  ) {
    updatePaymentServicesDto.userId = new Types.ObjectId(userId);
    return this.paymentServicesService.update(
      paymentServiceId,
      updatePaymentServicesDto,
    );
  }

  // Route for deleting a payment service for a user
  @Delete(':userId/payment-services/:paymentServiceId')
  removePaymentService(@Param('paymentServiceId') paymentServiceId: string) {
    return this.paymentServicesService.remove(paymentServiceId);
  }
}
