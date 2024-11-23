import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { TransactionMethodsService } from './transaction-methods.service';
import { TransactionMethods } from './transaction-methods.schema';
import {
  CreateTransactionMethodsDto,
  UpdateTransactionMethodsDto,
} from './dto/transaction-methods.dto';

@Controller('transaction-methods')
export class TransactionMethodsController {
  constructor(
    private readonly transactionMethodsService: TransactionMethodsService,
  ) {}

  @Post()
  create(@Body() createTransactionMethodDto: CreateTransactionMethodsDto) {
    return this.transactionMethodsService.create(createTransactionMethodDto);
  }

  @Get()
  findAll() {
    return this.transactionMethodsService.findAll();
  }
  @Get('/currency')
  findCurrencyMethods(@Query('currency') currency: string) {
    return this.transactionMethodsService.findCurrencyMethods(currency);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionMethodsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<UpdateTransactionMethodsDto>,
  ) {
    return this.transactionMethodsService.update(id, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionMethodsService.remove(id);
  }
}
