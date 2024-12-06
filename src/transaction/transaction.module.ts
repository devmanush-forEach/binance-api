import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { Transaction, TransactionSchema } from './transaction.schema';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { NotificationModule } from 'src/notification/notification.module';
import { CoinWalletModule } from 'src/coinWallet/coinWallet.module';

@Module({
  imports: [
    AuthModule,
    NotificationsModule,
    NotificationModule,
    CoinWalletModule,
    WalletModule,
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule {}
