import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import {
  CreateAdvertisementDto,
  GetAdvertisementsDto,
  SearchAdvertisementsDto,
  UpdateAdvertisementDto,
} from './dto/advertisement.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';

@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @Post()
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return this.advertisementService.create(createAdvertisementDto);
  }
  @Patch('toggleStatus/:id')
  async toggleStatus(@Param('id') id: string, @Param('userId') userId: string) {
    return this.advertisementService.toggleStatus(id, userId);
  }

  @Get()
  async findAll() {
    return this.advertisementService.findAll();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchAdvertisements(
    @Query() query: SearchAdvertisementsDto,
    @Param() params: any,
  ): Promise<any> {
    const {
      adType,
      coinId,
      currency,
      page,
      limit,
      paymentMethods,
      priceRange,
      region,
    } = query;
    return this.advertisementService.searchAdvertisements(
      {
        adType,
        coinId,
        currency,
        paymentMethods,
        requestUserId: params.userId,
        priceRange,
        region,
      },
      page,
      limit,
    );
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  async findAllForUser(
    @Param('userId') userId: string,
    @Query() query: GetAdvertisementsDto,
  ) {
    const { adType, coinId, page, limit, status, dateRange } = query;
    return this.advertisementService.findAllAdsForUser(
      { adType, coinId, requestUserId: userId, status, dateRange },
      page,
      limit,
    );
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
