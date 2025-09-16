import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskCreatedEvent } from '../events/task-created.event';
import { TaskCompletedEvent } from '../events/task-completed.event';

@Injectable()
export class TaskListener {
  private readonly logger = new Logger(TaskListener.name);

  @OnEvent('task.created')
  handleTaskCreatedEvent(payload: TaskCreatedEvent) {
    this.logger.log(`Task created: ${JSON.stringify(payload.task)}`);
  }

  @OnEvent('task.completed')
  handleTaskCompletedEvent(payload: TaskCompletedEvent) {
    this.logger.log(`Task completed: ${JSON.stringify(payload.task)}`);
  }
}
