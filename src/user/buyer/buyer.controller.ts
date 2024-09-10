import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BuyerService } from './buyer.service';

@Controller('users/buyers')
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @Post()
  async create(@Body() createBuyerDto: any) {
    return this.buyerService.create(createBuyerDto);
  }

  @Get()
  async findAll() {
    return this.buyerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.buyerService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateBuyerDto: any) {
    return this.buyerService.update(id, updateBuyerDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.buyerService.remove(id);
  }
}
