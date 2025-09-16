import { Task } from '../entities/task.entity';

export class TaskCompletedEvent {
  constructor(public readonly task: Task) {}
}
