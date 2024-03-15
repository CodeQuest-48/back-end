import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreatePremioDto {
  @IsString()
  @MinLength(1)
  titulo: string;

  @IsString()
  @MinLength(1)
  descripcion: string;

  @IsString()
  @IsOptional()
  foto: string;
}
