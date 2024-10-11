import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentServicesService } from './payment-services.service';
import { PaymentServicesController } from './payment-services.controller';
import {
  PaymentServices,
  PaymentServicesSchema,
} from './payment-services.schema';
import { TransactionMethodsModule } from 'src/transactions-methods/transaction-methods.module';

@Module({
  imports: [
    TransactionMethodsModule,
    MongooseModule.forFeature([
      { name: PaymentServices.name, schema: PaymentServicesSchema },
    ]),
  ],
  controllers: [PaymentServicesController],
  providers: [PaymentServicesService],
  exports: [PaymentServicesService],
})
export class PaymentServicesModule {}
