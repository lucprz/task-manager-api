import { IsOptional, IsBoolean, IsString, IsEnum } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({ description: 'El nuevo título de la tarea.', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'La nueva descripción de la tarea.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'El estado de la tarea (true para pasar a completada).',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  completed?: boolean;

  @ApiProperty({
    description: 'La nueva prioridad de la tarea.',
    enum: ['low', 'medium', 'high'],
    required: false,
  })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: 'low' | 'medium' | 'high';
}
