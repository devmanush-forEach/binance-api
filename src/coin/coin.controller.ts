import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CoinService } from './coin.service';

@Controller('coins')
export class CoinController {
  constructor(private readonly coinService: CoinService) { }

  @Post()
  async create(@Body() createCoinDto: any) {
    return this.coinService.create(createCoinDto);
  }
  @Post('/many')
  async createMany(@Body() createCoinsDto: any[]) {
    return this.coinService.createMany(createCoinsDto);
  }

  @Get()
  async findAll() {
    return this.coinService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.coinService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCoinDto: any) {
    return this.coinService.update(id, updateCoinDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.coinService.remove(id);
  }
}
