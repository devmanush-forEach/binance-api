import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import {
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
} from './dto/advertisement.dto';

@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) { }

  @Post()
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return this.advertisementService.create(createAdvertisementDto);
  }

  @Get()
  async findAll() {
    return this.advertisementService.findAll();
  }


  @Get('user/:id')
  async findAllForUser(@Param('id') id: string) {
    return this.advertisementService.findAllByUserId(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAdvertisementDto: UpdateAdvertisementDto,
  ) {
    return this.advertisementService.update(id, updateAdvertisementDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.advertisementService.remove(id);
  }

  @Get('/buy')
  async getAllBuyAdvertisements() {
    return this.advertisementService.getBuyAdvertisements();
  }

  @Get('/sell')
  async getAllSellAdvertisements() {
    return this.advertisementService.getSellAdvertisements();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.advertisementService.findOne(id);
  }
}
