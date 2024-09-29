import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdvertisementService } from './advertisement.service';
import { AdvertisementController } from './advertisement.controller';
import { Advertisement, AdvertisementSchema } from './advertisement.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    MongooseModule.forFeature([
      { name: Advertisement.name, schema: AdvertisementSchema },
    ]),
  ],
  controllers: [AdvertisementController],
  providers: [AdvertisementService],
})
export class AdvertisementModule { }
