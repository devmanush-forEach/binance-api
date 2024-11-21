import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Notification, NotificationSchema } from './notification.schema';
import { FirebaseService } from 'src/firebase/firebase.service';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema },
    ]),
  ],
  controllers: [NotificationController],
  providers: [FirebaseService, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
