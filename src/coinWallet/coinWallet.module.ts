import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  CoinWallet,
  CoinWalletSchema,
  CoinWalletDocument,
} from './coinWallet.schema';
import { CoinWalletController } from './coinWallet.controller';
import { CoinWalletService } from './coinWallet.service';

import { WalletModule } from 'src/wallet/wallet.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: CoinWallet.name, schema: CoinWalletSchema },
    ]),
  ],
  controllers: [CoinWalletController],
  providers: [CoinWalletService, CoinWallet],
  exports: [CoinWalletService, CoinWallet],
})
export class CoinWalletModule {}
