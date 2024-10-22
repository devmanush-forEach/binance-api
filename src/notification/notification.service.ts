import { Injectable } from '@nestjs/common';
import { FirebaseService } from 'src/config/firebase.config';
import { SaveTokenDto } from './dto/notification.dto';
import { UserService } from 'src/user/user.service';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class NotificationService {
  constructor(
    @InjectModel(Notification.name)
    private notificationModel: Model<Notification>,
    private readonly firebaseService: FirebaseService,
    private readonly userService: UserService,
  ) {}

  async sendNotification(token: string, payload: any) {
    const messaging = this.firebaseService.getMessaging();
    try {
      const response = await messaging.send({
        token,
        notification: {
          title: payload.title,
          body: payload.body,
        },
        data: payload.data || {}, // Custom data payload
      });
      return { success: true, response };
    } catch (error) {
      return { success: false, error };
    }
  }

  async saveToken(userId: string, saveTokenDto: SaveTokenDto) {
    try {
    } catch (error) {}
  }

  async saveFcmToken(userId: string, saveTokenDto: SaveTokenDto) {
    // Check if the token already exists for the user
    const { token } = saveTokenDto;
    const user = await this.userService.findUserById(userId);
    if (!user) throw new Error('User Not find');

    const existingNotification = await this.notificationModel.findOne({
      userId,
    });

    if (existingNotification) {
      // Update FCM token if it exists
      return this.notificationModel.updateOne({ userId }, { token });
    }

    // Create a new record if the token doesn't exist
    const newNotification = new this.notificationModel({ userId, token });
    return newNotification.save();
  }

  async removeFcmToken(userId: string) {
    return this.notificationModel.deleteOne({ userId });
  }
}
