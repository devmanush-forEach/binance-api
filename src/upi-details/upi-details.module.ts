import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UPIDetails, UPIDetailsSchema } from './upi-details.schema';
import { UPIDetailsService } from './upi-details.service';
import { UPIDetailsController } from './upi-details.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UPIDetails.name, schema: UPIDetailsSchema },
    ]),
  ],
  controllers: [UPIDetailsController],
  providers: [UPIDetailsService],
  exports: [UPIDetailsService]
})
export class UPIDetailsModule { }
