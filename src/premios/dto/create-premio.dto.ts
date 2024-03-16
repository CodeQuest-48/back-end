import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePremioDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsString()
  @IsOptional()
  urlImage: string;
}
