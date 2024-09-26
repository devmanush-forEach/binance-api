import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BankDetails, BankDetailsSchema } from './bank-details.schema';
import { BankDetailsService } from './bank-details.service';
import { BankDetailsController } from './bank-details.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BankDetails.name, schema: BankDetailsSchema },
    ]),
  ],
  controllers: [BankDetailsController],
  providers: [BankDetailsService],
  exports: [BankDetailsService],
})
export class BankDetailsModule {}
