import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({
    description: 'El título de la tarea.',
    example: 'Organizar la oficina',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'La descripción de la tarea.',
    example: 'Limpiar el escritorio y archivar documentos',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'La prioridad de la tarea.',
    enum: ['low', 'medium', 'high'],
    default: 'low',
    required: false,
  })
  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';
}
