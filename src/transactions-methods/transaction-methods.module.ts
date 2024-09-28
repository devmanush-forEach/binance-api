import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionMethodsService } from './transaction-methods.service';
import { TransactionMethodsController } from './transaction-methods.controller';
import { TransactionMethods, TransactionMethodsSchema } from './transaction-methods.schema';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: TransactionMethods.name, schema: TransactionMethodsSchema }]),
    ],
    controllers: [TransactionMethodsController],
    providers: [TransactionMethodsService],
    exports: [TransactionMethodsService]
})
export class TransactionMethodsModule { }
