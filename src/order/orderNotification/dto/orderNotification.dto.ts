import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsArray,
  ArrayMaxSize,
  IsNumber,
} from 'class-validator';
import { Types } from 'mongoose';

export class CreateOrderNotificationDto {
  @IsOptional()
  @IsString()
  sender: string;

  @IsOptional()
  orderId?: string;

  @IsNotEmpty()
  @IsNumber()
  orderNumber: Number;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  images?: string[]; // Max 3 images

  @IsOptional()
  @IsBoolean()
  transactionCompleted?: boolean;
}
