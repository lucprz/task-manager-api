import { IsOptional, IsEnum, IsBoolean, IsNumberString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TaskQueryDto {
  @ApiProperty({
    description: 'Filtra las tareas por prioridad.',
    enum: ['low', 'medium', 'high'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Filtra las tareas por estado completado.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }): boolean => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  completed?: boolean;

  @ApiProperty({
    description: 'Número de página.',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  page?: string;

  @ApiProperty({
    description: 'Número de tareas por página.',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  limit?: string;
}
