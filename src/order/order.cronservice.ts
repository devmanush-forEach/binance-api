import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OrderService } from './order.service'; // Replace with your actual service
import { AdvertisementService } from 'src/advertisement/advertisement.service';
import { Advertisement } from 'src/advertisement/advertisement.schema';

@Injectable()
export class OrderCronService {
  constructor(
    private readonly orderService: OrderService,
    private readonly adService: AdvertisementService,
  ) {}

  @Cron('*/5 * * * * *')
  async handlePendingOrders() {
    const pendingOrders: any[] = await this.orderService.getPendingOrders();

    for (const order of pendingOrders) {
      const ad: any = order.ad; // Get the associated ad details
      const limitInMinutes = ad.transactionTimeLimit; // Time limit in minutes
      const createdAt = new Date(order.createdAt); // Order creation time

      // Calculate expiry time by adding the limit to the createdAt time
      const expiryTime = new Date(
        createdAt.getTime() + limitInMinutes * 60 * 1000,
      );

      console.log(
        `Order Created At: ${createdAt}, Expiry Time: ${expiryTime}, Current Time: ${new Date()}`,
      );

      // Check if the current time has passed the expiry time
      if (new Date() > expiryTime) {
        await this.orderService.cancelOrder(order._id, {
          cancelledBy: 'system',
          reason: 'Payment Time Limit Exceeds',
        });
        console.log(`Order ${order._id} has been cancelled.`);
      }
    }
  }
}
