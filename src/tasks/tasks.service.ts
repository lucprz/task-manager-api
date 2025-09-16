import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskQueryDto } from './dto/task-query.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ExternalTask } from './interfaces/external-task.interface';
import { TaskCreatedEvent } from './events/task-created.event';
import { TaskCompletedEvent } from './events/task-completed.event';
import { Role } from 'src/common/enums/role.enum';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
    private httpService: HttpService,
    private configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const newTask = this.tasksRepository.create({ ...createTaskDto, userId });
    const savedTask = await this.tasksRepository.save(newTask);
    this.eventEmitter.emit('task.created', new TaskCreatedEvent(savedTask));
    return savedTask;
  }

  async populateTasks(
    userId: string,
    apiKey: string,
  ): Promise<{ created: number; duplicated: number }> {
    const requiredApiKey =
      this.configService.getOrThrow<string>('EXTERNAL_API_KEY');
    if (apiKey !== requiredApiKey) {
      throw new UnauthorizedException('Invalid API Key');
    }

    const apiUrl = this.configService.getOrThrow<string>('EXTERNAL_API_URL');
    const response = await firstValueFrom(
      this.httpService.get<ExternalTask[]>(apiUrl),
    );
    const externalTasks = response.data;

    let createdCount = 0;
    let duplicatedCount = 0;

    for (const externalTask of externalTasks) {
      const existingTask = await this.tasksRepository.findOne({
        where: {
          title: externalTask.title,
          userId: userId,
        },
      });

      if (existingTask) {
        duplicatedCount++;
      } else {
        const newTask = this.tasksRepository.create({
          title: externalTask.title,
          description: '',
          completed: externalTask.completed,
          userId: userId,
        });
        await this.tasksRepository.save(newTask);
        createdCount++;
      }
    }

    return { created: createdCount, duplicated: duplicatedCount };
  }

  async findAll(userId: string, query?: TaskQueryDto) {
    const { page, limit, priority, completed } = query || {};

    const findOptions: FindManyOptions<Task> = {
      where: { userId },
      order: { createdAt: 'DESC' },
    };

    const parsedPage = parseInt(String(page), 10) || 1;
    const parsedLimit = parseInt(String(limit), 10) || 10;

    findOptions.skip = (parsedPage - 1) * parsedLimit;
    findOptions.take = parsedLimit;

    if (priority) {
      findOptions.where = { ...findOptions.where, priority };
    }

    if (completed !== undefined) {
      findOptions.where = { ...findOptions.where, completed };
    }

    const [tasks, total] = await this.tasksRepository.findAndCount(findOptions);

    return {
      data: tasks,
      meta: {
        total,
        lastPage: Math.ceil(total / parsedLimit),
        currentPage: parsedPage,
        perPage: parsedLimit,
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);
    if (!task) {
      throw new NotFoundException(
        'Task not found or you do not have permission.',
      );
    }

    const wasCompleted = task.completed;
    const updatedTask = await this.tasksRepository.save({
      ...task,
      ...updateTaskDto,
    });

    if (updateTaskDto.completed === true && !wasCompleted) {
      this.eventEmitter.emit(
        'task.completed',
        new TaskCompletedEvent(updatedTask),
      );
    }
    return updatedTask;
  }

  async remove(id: string, user: User): Promise<void> {
    const task = await this.tasksRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found.`);
    }

    if (user.role === Role.Admin || task.user.id === user.id) {
      await this.tasksRepository.delete(id);
    } else {
      throw new UnauthorizedException(
        'You do not have permission to delete this task.',
      );
    }
  }
}
