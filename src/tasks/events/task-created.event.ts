import { Task } from '../entities/task.entity';

export class TaskCreatedEvent {
  constructor(public readonly task: Task) {}
}
