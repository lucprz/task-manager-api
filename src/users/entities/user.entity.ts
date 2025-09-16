import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Task } from 'src/tasks/entities/task.entity';
import { Role } from 'src/common/enums/role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password?: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];
}
