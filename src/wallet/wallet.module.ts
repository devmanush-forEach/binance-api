import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { Coin, CoinSchema } from 'src/coin/coin.schema';
import { Wallet, WalletSchema } from './wallet.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CoinModule } from 'src/coin/coin.module';

@Module({
  imports: [
    CoinModule,
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema }]),
    MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }]),
  ],
  providers: [WalletService],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule { }
