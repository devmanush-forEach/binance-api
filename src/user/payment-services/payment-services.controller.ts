import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PaymentServicesService } from './payment-services.service';
import {
  CreatePaymentServicesDto,
  UpdatePaymentServicesDto,
} from './dto/payment-services.dto';

@Controller('payment-service')
export class PaymentServicesController {
  constructor(
    private readonly paymentServicesService: PaymentServicesService,
  ) {}

  @Post()
  create(@Body() createPaymentServicesDto: CreatePaymentServicesDto) {
    return this.paymentServicesService.create(createPaymentServicesDto);
  }

  @Get()
  findAll() {
    return this.paymentServicesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentServicesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePaymentServicesDto: UpdatePaymentServicesDto,
  ) {
    return this.paymentServicesService.update(id, updatePaymentServicesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.paymentServicesService.remove(id);
  }
}
