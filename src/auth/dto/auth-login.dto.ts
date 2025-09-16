import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthLoginDto {
  @ApiProperty({ description: 'El nombre de usuario para iniciar sesión.' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'La contraseña para la cuenta.' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
