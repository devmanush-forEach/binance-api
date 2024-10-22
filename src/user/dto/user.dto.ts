import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsPhoneNumber,
  IsBoolean,
  IsOptional,
  IsString,
  IsNumberString,
  Min,
} from 'class-validator';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  // @IsPhoneNumber(null)
  phone: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsNotEmpty()
  @IsMongoId()
  country: string;

  @IsOptional()
  @IsMongoId({ each: true }) // Array of MongoDB ObjectIds
  badges?: string[];

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  confirmPassword: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber(null) // Use country code, e.g., 'US'
  phone?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsBoolean()
  phoneVerified?: boolean;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;

  @IsOptional()
  @IsMongoId()
  country?: string;

  @IsOptional()
  @IsMongoId({ each: true }) // Array of MongoDB ObjectIds
  badges?: string[];

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: Role;
}

export class GetUsersDto {
  @IsOptional()
  @IsString()
  readonly name?: string;

  @IsOptional()
  @IsString()
  readonly email?: string;

  @IsOptional()
  @IsString()
  readonly phone?: string;

  @IsOptional()
  @IsNumberString()
  @Min(1)
  readonly page?: number;

  @IsOptional()
  @IsNumberString()
  @Min(1)
  readonly limit?: number;
}
