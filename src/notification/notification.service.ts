import { BadRequestException, Injectable } from '@nestjs/common';
import { NotificationDto, SaveTokenDto } from './dto/notification.dto';
import { UserService } from 'src/user/user.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './notification.schema';
import { FirebaseService } from 'src/firebase/firebase.service';

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
    if (!existingNotification) return;

    const tokens: string[] = existingNotification.fcmToken;

    if (!tokens?.length) return;
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
    if (!user) throw new BadRequestException('Validation Error !');

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
