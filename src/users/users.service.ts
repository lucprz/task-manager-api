import {
  ConflictException,
  Injectable,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { AuthSignupDto } from '../auth/dto/auth-signup.dto';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class UsersService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap() {
    const adminUser = await this.usersRepository.findOne({
      where: { username: 'admin' },
    });
    if (!adminUser) {
      const newUser = this.usersRepository.create({
        username: 'admin',
        password: await bcrypt.hash('password', 10),
        role: Role.Admin,
      });
      await this.usersRepository.save(newUser);
    }
  }

  async create(authSignupDto: AuthSignupDto): Promise<User> {
    const { username, password } = authSignupDto;

    const existingUser = await this.usersRepository.findOne({
      where: [{ username }],
    });
    if (existingUser) {
      throw new ConflictException('Username already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = this.usersRepository.create({
      username,
      password: hashedPassword,
      role: Role.User,
    });

    return this.usersRepository.save(newUser);
  }

  async findOne(username: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { username } });
    return user;
  }
}
