// src/user/user.module.ts
import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './user.schema';
import { UserController } from './user.controller';
import { WalletModule } from 'src/wallet/wallet.module';
import { UPIDetailsModule } from 'src/upi-details/upi-details.module';
import { BankDetailsModule } from 'src/bank-details/bank-details.module';
import { AuthModule } from 'src/auth/auth.module';
import { TransactionMethodsModule } from 'src/transactions-methods/transaction-methods.module';

@Module({
  imports: [
    WalletModule,
    UPIDetailsModule,
    BankDetailsModule,
    TransactionMethodsModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule)
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule { }
