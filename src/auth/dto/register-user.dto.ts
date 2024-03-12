import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsBoolean,
  Matches,
} from 'class-validator';

export class RegisterUserDto {
  @ApiProperty({
    example: 'usuario@gmail.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @MinLength(6, { message: 'la contraseña debe ser al menos 6 caracteres' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'La contraseña debe tener al menos una mayuscula, una minuscula y un número',
  })
  password: string;

  @ApiProperty({
    example: 'Juan',
    description: 'Nombre del usuario',
  })
  @IsString()
  @MaxLength(50)
  nombre: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Teléfono del usuario',
    nullable: true,
  })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  telefono?: string;

  @ApiProperty({
    example: 'Calle 123 # 123-123',
    description: 'Dirección del usuario',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  direccion?: string;

  @ApiProperty({
    example: 'usuario',
    description: 'Rol del usuario',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  rol?: string;

  @ApiProperty({
    example: true,
    description: 'Estado de activación del usuario',
    nullable: true,
  })
  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
