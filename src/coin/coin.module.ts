import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coin, CoinSchema } from './coin.schema';
import { CoinService } from './coin.service';
import { CoinController } from './coin.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Coin.name, schema: CoinSchema }]),
  ],
  controllers: [CoinController],
  providers: [CoinService],
})
export class CoinModule {}
