// src/user-badges/dto/create-user-badge.dto.ts

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserBadgeDto {
  @IsNotEmpty()
  @IsString()
  badgeName: string;

  @IsNotEmpty()
  @IsString()
  badgeIcon: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  isActive?: boolean;
}
