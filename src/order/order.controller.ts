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

  @Post(':orderId/notify')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images', 3))
  async createOrderNotification(
    @UploadedFiles() files: Express.Multer.File[],
    @Param('orderId') orderId: string,
    @Param('userId') userId: string,
    @Body() createOrderNotificationDto: CreateOrderNotificationDto,
  ) {
    try {
      // Upload images to S3 using AwsService
      const imageUrls = await this.awsService.uploadImages(files);

      // Add image URLs to the DTO
      createOrderNotificationDto.images = imageUrls;

      // Create the order notification
      const notification =
        await this.orderNotificationService.createNotification({
          ...createOrderNotificationDto,
          orderId,
          sender: userId,
        });

      // Call the pushNotification method to notify the recipient
      this.chatGateway.pushNotification(notification.reciever.toString(), {
        title: 'Order Notification',
        message: `You have a new notification for order ${orderId}.`,
        orderId,
      });

      // Return the created notification
      return notification;
    } catch (error) {
      console.error('Error creating order notification:', error);
      throw new HttpException(
        'Failed to create order notification',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

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
