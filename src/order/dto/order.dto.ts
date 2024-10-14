import {
  IsOptional,
  IsEnum,
  IsInt,
  IsString,
  IsObject,
  Min,
  IsDate,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Order } from '../order.schema';

// Define possible values for 'type' and 'status' enums
enum OrderType {
  BUY = 'buy',
  SELL = 'sell',
}

export class DateRangeDTO {
  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'fromDate must be a valid date' })
  fromDate?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate({ message: 'toDate must be a valid date' })
  toDate?: Date;
}

enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  CANCELED = 'canceled',
}

export class OrderFilterDTO {
  @IsOptional()
  @IsEnum(OrderType, { message: 'type must be either "buy" or "sell"' })
  type?: OrderType;

  @IsOptional()
  @IsEnum(OrderStatus, {
    message:
      'status must be either "pending", "processing", "completed", or "canceled"',
  })
  status?: OrderStatus;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number) // Ensure the query param is cast to a number
  page?: number = 1;

  @IsOptional()
  @IsString()
  coinId?: string;

  @IsOptional()
  @IsString()
  currencyId?: string;

  @IsOptional()
  @IsObject()
  @Type(() => DateRangeDTO) // Use a nested DTO for date range
  dateRange?: DateRangeDTO;

  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Ensure the query param is cast to a number
  orderNo?: number;
}

// Define the DateRangeDTO to structure the date range filter

export interface OrderResponse {
  orders: Order[];
  currentPage: number;
  totalPages: number;
  total: number;
}
