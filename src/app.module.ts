import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoinModule } from './coin/coin.module';
import { OrderModule } from './order/order.module';
import { UPIDetailsModule } from './upi-details/upi-details.module';
import { TransactionModule } from './transaction/transaction.module';
import { BankDetailsModule } from './bank-details/bank-details.module';
import { ConfigModule } from '@nestjs/config';
import { UpiModule } from './upi/upi.module';
import { TransactionMethodsModule } from './transactions-methods/transaction-methods.module';
import { WalletModule } from './wallet/wallet.module';
import { AdvertisementModule } from './advertisement/advertisement.module';
import { CurrencyModule } from './currency/currency.module';
import { ChatModule } from './chat/chat.module';
import { NetworkModule } from './network/network.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CountryModule } from './country/country.module';
import { CounterModule } from './counter/counter.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://nikhil:BwBkJQcpwmnmJRLG@ck-clustor.u9m29.mongodb.net/?retryWrites=true&w=majority&appName=ck-clustor',
    ),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule,
    UserModule,
    CoinModule,
    OrderModule,
    UPIDetailsModule,
    TransactionModule,
    BankDetailsModule,
    UpiModule,
    TransactionMethodsModule,
    WalletModule,
    AdvertisementModule,
    CurrencyModule,
    ChatModule,
    NetworkModule,
    NotificationsModule,
    CountryModule,
    CounterModule,
    // OTPModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
