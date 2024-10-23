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
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { Order } from './order.schema';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import {
  CancelOrderDto,
  CreateOrderDto,
  OrderFilterDTO,
  OrderResponse,
} from './dto/order.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateOrderNotificationDto } from './orderNotification/dto/orderNotification.dto';
import { OrderNotificationService } from './orderNotification/orderNotification.service';
import { AwsService } from 'src/aws/aws.service';
import { ChatGateway } from 'src/chat/chat.gateway';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly orderNotificationService: OrderNotificationService,
    private readonly awsService: AwsService,
    private readonly chatGateway: ChatGateway,
  ) {}

  @Post(':orderId/transferred')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 3))
  async createOrderNotification(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
    @Body() createOrderNotificationDto: CreateOrderNotificationDto,
  ) {
    try {
      const imageUrls = await this.awsService.uploadImages(files);

      createOrderNotificationDto.images = imageUrls;

      const notification =
        await this.orderNotificationService.transaferredNotification({
          ...createOrderNotificationDto,
          orderId,
          sender: userId,
        });

      return notification;
    } catch (error) {
      console.error('Error creating order notification:', error);
      throw new HttpException(
        'Failed to create order notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post(':orderId/release-crypto')
  @UseGuards(JwtAuthGuard)
  async releaseCrypto(
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
  ) {
    return this.orderService.releaseCrypto(orderId, userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createOrderDto: CreateOrderDto,
    @Param('userId') userId: string,
  ): Promise<Order> {
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

  @Patch(':orderId/cancel')
  cancelOrder(
    @Param('orderId') orderId: string,
    @Body() cancelOrderDto: CancelOrderDto,
  ): Promise<Order> {
    return this.orderService.cancelOrder(orderId, cancelOrderDto);
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
