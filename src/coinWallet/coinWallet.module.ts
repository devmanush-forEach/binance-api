import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoinWallet, CoinWalletSchema } from './coinWallet.schema';
import { CoinWalletController } from './coinWallet.controller';
import { CoinWalletService } from './coinWallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CoinWallet.name, schema: CoinWalletSchema },
    ]),
  ],
  controllers: [CoinWalletController],
  providers: [CoinWalletService],
})
export class CoinWalletModule {}
