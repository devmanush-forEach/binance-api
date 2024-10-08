import { IsOptional, IsString, IsNumberString, Min } from 'class-validator';

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
