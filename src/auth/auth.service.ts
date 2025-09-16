import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { User } from 'src/users/entities/user.entity';
import { AuthSignupDto } from './dto/auth-signup.dto';

type UserWithoutPassword = Omit<User, 'password'>;

interface JwtPayload {
  sub: string;
  username: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    username: string,
    pass: string,
  ): Promise<UserWithoutPassword | null> {
    const user = await this.usersService.findOne(username);
    if (user && user.password) {
      const isMatch = await bcrypt.compare(pass, user.password);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async getTokens(userId: string, username: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, username, role },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, username, role },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async signup(authSignupDto: AuthSignupDto) {
    const existingUser = await this.usersService.findOne(
      authSignupDto.username,
    );
    if (existingUser) {
      throw new ConflictException('Username already exists.');
    }

    await this.usersService.create(authSignupDto);

    return { message: 'User registered successfully. Please log in.' };
  }

  async login(authLoginDto: AuthLoginDto) {
    const { username, password } = authLoginDto;
    const user = await this.validateUser(username, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.username, user.role);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refresh(authRefreshDto: AuthRefreshDto) {
    try {
      const { refreshToken } = authRefreshDto;
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET,
        },
      );

      const user = await this.usersService.findOne(payload.username);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const newTokens = await this.getTokens(user.id, user.username, user.role);

      return {
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
