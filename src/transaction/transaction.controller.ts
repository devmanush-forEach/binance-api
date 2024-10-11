// src/transactions/transaction.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { Transaction } from './transaction.schema';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import {
  DepositDto,
  SearchTransactionsDto,
  WithdrawalDto,
} from './dto/transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() createTransactionDto: any): Promise<Transaction> {
    return this.transactionService.create(createTransactionDto);
  }

  @Get('/search')
  searchTransactions(
    @Query() filters: SearchTransactionsDto,
  ): Promise<Transaction[]> {
    return this.transactionService.searchTransactions(filters);
  }

  @Get()
  findAll(): Promise<Transaction[]> {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionService.findOne(id);
  }

  @Post('deposit')
  @UseGuards(JwtAuthGuard)
  async deposit(
    @Param('userId') userId: string,
    @Body() depositDto: DepositDto,
  ) {
    return this.transactionService.deposit(userId, depositDto);
  }

  @Post('withdraw')
  @UseGuards(JwtAuthGuard)
  async withdraw(
    @Param('userId') userId: string,
    @Body() withdrawDto: WithdrawalDto,
  ) {
    return this.transactionService.withdraw(userId, withdrawDto);
  }
  @Patch('complete/:id')
  // @UseGuards(JwtAuthGuard)
  async complete(@Param('userId') userId: string, @Param('id') id: string) {
    return this.transactionService.complete(id);
  }

  @Patch('fail/:id')
  // @UseGuards(JwtAuthGuard)
  async fail(@Param('userId') userId: string, @Param('id') id: string) {
    return this.transactionService.fail(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionDto: any,
  ): Promise<Transaction> {
    return this.transactionService.update(id, updateTransactionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.transactionService.remove(id);
  }
}
