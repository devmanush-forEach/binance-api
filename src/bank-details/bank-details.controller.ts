import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BankDetailsService } from './bank-details.service';

@Controller('bank-details')
export class BankDetailsController {
  constructor(private readonly bankDetailsService: BankDetailsService) {}

  @Post()
  async create(@Body() createBankDetailsDto: any) {
    return this.bankDetailsService.create(createBankDetailsDto);
  }

  @Get()
  async findAll() {
    return this.bankDetailsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bankDetailsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBankDetailsDto: any) {
    return this.bankDetailsService.update(id, updateBankDetailsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.bankDetailsService.remove(id);
  }
}
