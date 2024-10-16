import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadImageDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;
}
