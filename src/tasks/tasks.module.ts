import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';
import { UsersModule } from 'src/users/users.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TaskListener } from './listeners/task.listener';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    UsersModule,
    HttpModule,
    ConfigModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [TasksController],
  providers: [TasksService, TaskListener],
})
export class TasksModule {}
