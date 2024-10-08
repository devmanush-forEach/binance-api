import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NetworkService } from './network.service';
import { CreateNetworkDto, UpdateNetworkDto } from './dto/network.dto';

@Controller('networks')
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  @Post()
  create(@Body() createNetworkDto: CreateNetworkDto) {
    return this.networkService.create(createNetworkDto);
  }

  @Get()
  findAll() {
    return this.networkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.networkService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNetworkDto: UpdateNetworkDto) {
    return this.networkService.update(id, updateNetworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.networkService.remove(id);
  }
}
