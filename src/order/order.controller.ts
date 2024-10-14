// src/order/order.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { CreateOrderDto, OrderFilterDTO, OrderResponse } from './dto/order.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.orderService.create(createOrderDto);
  }

  @Get('/by-user')
  @UseGuards(JwtAuthGuard)
  findAllByUser(
    @Param('userId') userId: string,
    @Query() filters: OrderFilterDTO,
  ): Promise<OrderResponse> {
    return this.orderService.findAllByUser(userId, filters);
  }
  @Get('/for-user')
  @UseGuards(JwtAuthGuard)
  findAllForUser(
    @Param('userId') userId: string,
    @Query() filters: OrderFilterDTO,
  ): Promise<OrderResponse> {
    return this.orderService.findAllForUser(userId, filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.orderService.findOne(id);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.orderService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: any): Promise<Order> {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderService.remove(id);
  }
}
