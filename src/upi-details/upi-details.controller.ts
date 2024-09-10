import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UPIDetailsService } from './upi-details.service';

@Controller('upi-details')
export class UPIDetailsController {
  constructor(private readonly upiDetailsService: UPIDetailsService) {}

  @Post()
  async create(@Body() createUPIDetailsDto: any) {
    return this.upiDetailsService.create(createUPIDetailsDto);
  }

  @Get()
  async findAll() {
    return this.upiDetailsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.upiDetailsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUPIDetailsDto: any) {
    return this.upiDetailsService.update(id, updateUPIDetailsDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.upiDetailsService.remove(id);
  }
}
