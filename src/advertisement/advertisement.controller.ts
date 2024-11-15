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
  BadRequestException,
} from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import {
  CreateAdvertisementDto,
  GetAdvertisementsDto,
  SearchAdvertisementsDto,
  UpdateAdvertisementDto,
} from './dto/advertisement.dto';
import { JwtAuthGuard } from 'src/auth/gaurds/jwt-auth.gaurd';
import { AuthService } from 'src/auth/auth.service';

@Controller('advertisements')
export class AdvertisementController {
  constructor(
    private readonly advertisementService: AdvertisementService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('userId') userId: string,
    @Body() createAdvertisementDto: CreateAdvertisementDto,
  ) {
    const transactionPassword = createAdvertisementDto.transactionPassword;
    delete createAdvertisementDto.transactionPassword;
    const adType = createAdvertisementDto.adType;
    if (adType === 'sell') {
      if (!transactionPassword) {
        throw new BadRequestException(
          'Please Enter A Valid Transaction Password!',
        );
      }

      const isVerified = await this.authService.verifyTransactionPassword(
        userId,
        { transactionPassword },
      );
      if (!isVerified) {
        throw new BadRequestException(
          'Please Enter A Valid Transaction Password!',
        );
      }
    }
    return this.advertisementService.create(createAdvertisementDto);
  }
  @Patch('toggleStatus/:id')
  async toggleStatus(@Param('id') id: string, @Param('userId') userId: string) {
    return this.advertisementService.toggleStatus(id, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.advertisementService.findAll();
  }

  @Get('detail/:adId')
  @UseGuards(JwtAuthGuard)
  async getDetails(
    @Param('userId') userId: string,
    @Param('adId') adId: string,
  ) {
    return this.advertisementService.getDetails(userId, adId);
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
    const { adType, coinId, page, limit, status, dateRange, currency } = query;
    return this.advertisementService.findAllAdsForUser(
      { adType, coinId, requestUserId: userId, status, dateRange, currency },
      page,
      limit,
    );
  }

  @Patch('update/:id')
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
