import { IsNotEmpty, IsString } from 'class-validator';

export class SaveTokenDto {
  @IsString()
  @IsNotEmpty()
  token: string;
}
