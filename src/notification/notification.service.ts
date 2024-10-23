import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/config/firebase.config';
import { NotificationDto, SaveTokenDto } from './dto/notification.dto';
import { UserService } from 'src/user/user.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './notification.schema';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {}

  async sendNotificationByToken(token: string, payload: NotificationDto) {
    const messaging = this.firebaseService.getMessaging();
    try {
      const response = await messaging.send({
        token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {},
      });
      return { success: true, response };
    } catch (error) {
      return { success: false, error };
    }
  }

  async sendNotificationByUserId(userId: string, payload: NotificationDto) {
    const messaging = this.firebaseService.getMessaging();
    const existingNotification = await this.notificationModel.findOne({
      userId,
    });
    if (!existingNotification) throw new Error('No Token Found!');

    const tokens: string[] = existingNotification.fcmToken;

    if (!tokens?.length) throw new Error('No Token Found!');
    try {
      for (let token of tokens) {
        const response = await messaging.send({
          token,
          notification: {
            title: payload.title,
            body: payload.body,
          },
          data: payload.data || {},
        });
      }
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }

  async saveFcmToken(userId: string, saveTokenDto: SaveTokenDto) {
    const { token } = saveTokenDto;

    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error('User Not found');

    const existingNotification = await this.notificationModel.findOne({
      userId,
    });

    if (existingNotification) {
      if (!existingNotification.fcmToken.includes(token)) {
        await this.notificationModel.updateOne(
          { userId },
          { $push: { fcmToken: token } },
        );
      }
      return existingNotification;
    }

    const newNotification = new this.notificationModel({
      userId,
      fcmToken: [token],
    });

    const data = await newNotification.save();
    return data;
  }

  async removeFcmToken(userId: string, token: string) {
    return this.notificationModel.deleteOne({ userId });
  }
}
