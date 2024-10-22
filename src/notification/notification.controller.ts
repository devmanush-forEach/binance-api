import { Controller, Post, Body, UseGuards, Param } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { SaveTokenDto } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post('send')
  async sendNotification(@Body() body: any) {
    const { token, title, body: messageBody, data } = body;
    const payload = { title, body: messageBody, data };
    return this.notificationService.sendNotification(token, payload);
  }
  @Post('send')
  @UseGuards(JwtAuthGuard)
  async token(
    @Param('userId') userId: string,
    @Body() saveTokenDto: SaveTokenDto,
  ) {
    return this.notificationService.saveToken(userId, saveTokenDto);
  }
}
