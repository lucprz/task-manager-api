import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthSignupDto {
  @ApiProperty({
    example: 'juanperez',
    description: 'El nombre de usuario para el registro.',
    minLength: 5,
    maxLength: 15,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(15)
  username: string;

  @ApiProperty({
    example: 'password123',
    description: 'La contraseña para el registro.',
    minLength: 9,
    maxLength: 20,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(20)
  password: string;
}
