import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Headers,
  UnauthorizedException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { UserDecorator } from 'src/common/decorators/user.decorator';
import { User } from 'src/users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { CacheKeyInterceptor } from 'src/common/interceptors/cache-key.interceptor';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@SkipThrottle()
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @ApiOperation({
    summary: 'Crea una nueva tarea para el usuario autenticado.',
  })
  @ApiResponse({
    status: 201,
    description: 'La tarea ha sido creada exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @UsePipes(new ValidationPipe())
  create(@Body() createTaskDto: CreateTaskDto, @UserDecorator() user: User) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Get('populate')
  @ApiOperation({
    summary: 'Llena la base de datos del usuario con tareas de prueba.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tareas de prueba creadas exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'API Key inválida.' })
  async populate(
    @UserDecorator() user: User,
    @Headers('x-api-key') apiKey: string,
  ) {
    if (!apiKey) {
      throw new UnauthorizedException('API Key is missing');
    }
    return this.tasksService.populateTasks(user.id, apiKey);
  }

  @Get()
  @ApiOperation({
    summary:
      'Obtiene una lista de tareas del usuario autenticado, con filtros y paginación.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de tareas devuelta exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiQuery({
    name: 'priority',
    enum: ['low', 'medium', 'high'],
    required: false,
  })
  @ApiQuery({ name: 'completed', type: 'boolean', required: false })
  @ApiQuery({ name: 'page', type: 'number', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @UseInterceptors(CacheKeyInterceptor)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  )
  findAll(@UserDecorator() user: User, @Query() query: TaskQueryDto) {
    return this.tasksService.findAll(user.id, query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtiene una tarea mediante su ID.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tarea encontrada exitosamente.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  findOne(@Param('id') id: string, @UserDecorator() user: User) {
    return this.tasksService.findOne(id, user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza una tarea existente por su ID.' })
  @ApiResponse({ status: 200, description: 'La tarea ha sido actualizada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  @UsePipes(new ValidationPipe())
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @UserDecorator() user: User,
  ) {
    return this.tasksService.update(id, updateTaskDto, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Elimina una tarea por su ID.' })
  @ApiResponse({ status: 200, description: 'La tarea ha sido eliminada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 404, description: 'Tarea no encontrada.' })
  remove(@Param('id') id: string, @UserDecorator() user: User) {
    return this.tasksService.remove(id, user);
  }
}
