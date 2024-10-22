import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { FirebaseService } from 'src/config/firebase.config';
import { NotificationController } from './notification.controller';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [NotificationController],
  providers: [FirebaseService, NotificationService],
  exports: [NotificationService],
})
export class NotificationModule {}
