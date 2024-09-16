import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TransactionMethodsService } from './transaction-methods.service';
import { TransactionMethods } from './transaction-methods.schema';

@Controller('transaction-methods')
export class TransactionMethodsController {
    constructor(private readonly transactionMethodsService: TransactionMethodsService) { }

    @Post()
    create(@Body() createTransactionMethodDto: TransactionMethods) {
        return this.transactionMethodsService.create(createTransactionMethodDto);
    }

    @Get()
    findAll() {
        return this.transactionMethodsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.transactionMethodsService.findOne(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() updateData: Partial<TransactionMethods>) {
        return this.transactionMethodsService.update(id, updateData);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.transactionMethodsService.remove(id);
    }
}
