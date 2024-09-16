import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UpiService } from './upi.service';

@Controller('upi')
export class UpiController {
    constructor(private readonly upiService: UpiService) { }

    @Post()
    async create(@Body() createUpiDto: any) {
        return this.upiService.create(createUpiDto);
    }

    @Get()
    async findAll() {
        return this.upiService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.upiService.findOne(id);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUpiDto: any) {
        return this.upiService.update(id, updateUpiDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return this.upiService.delete(id);
    }
}
