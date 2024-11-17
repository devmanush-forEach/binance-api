import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { CoinWalletService } from './coinWallet.service';
import { CreateCoinWalletDto, UpdateCoinWalletDto } from './dto/coinWallet.dto';
import { CoinWallet } from './coinWallet.schema';

@Controller('coin-wallet')
export class CoinWalletController {
  constructor(private readonly coinWalletService: CoinWalletService) {}

  @Post('create-many')
  createMany(@Body() createCoinWalletsDto: CreateCoinWalletDto[]) {
    return this.coinWalletService.createMany(createCoinWalletsDto);
  }

  @Post()
  create(@Body() createCoinWalletDto: CreateCoinWalletDto) {
    return this.coinWalletService.create(createCoinWalletDto);
  }

  @Get()
  findAll() {
    return this.coinWalletService.findAll();
  }

  @Get('search')
  async searchByCoinId(@Query('coinId') coinId: string): Promise<CoinWallet[]> {
    return this.coinWalletService.searchByCoinId(coinId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coinWalletService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCoinWalletDto: UpdateCoinWalletDto,
  ) {
    return this.coinWalletService.update(id, updateCoinWalletDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coinWalletService.remove(id);
  }
}
