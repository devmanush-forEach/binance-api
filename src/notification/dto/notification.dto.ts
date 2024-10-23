import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SaveTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
export class NotificationDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  body?: string;

  @IsOptional()
  data?: any;
}
