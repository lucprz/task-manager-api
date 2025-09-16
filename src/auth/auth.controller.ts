import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthRefreshDto } from './dto/auth-refresh.dto';
import { AuthSignupDto } from './dto/auth-signup.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthResponseDto } from './dto/auth-refresh-response.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Registra un nuevo usuario.' })
  @ApiResponse({
    status: 201,
    description: 'Registro exitoso.',
  })
  @ApiResponse({ status: 409, description: 'Usuario ya existe.' })
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ValidationPipe())
  async signup(@Body() authSignupDto: AuthSignupDto) {
    return this.authService.signup(authSignupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Inicia sesión y devuelve un token JWT.' })
  @ApiResponse({
    status: 200,
    description: 'Inicio de sesión exitoso, token devuelto.',
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
  @ApiResponse({
    status: 429,
    description: 'Se ha excedido el límite de peticiones.',
  })
  @UseGuards(ThrottlerGuard)
  @UsePipes(new ValidationPipe())
  async login(@Body() authLoginDto: AuthLoginDto) {
    return this.authService.login(authLoginDto);
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresca el token de acceso con un token de actualización',
  })
  @ApiResponse({
    status: 200,
    description: 'Token de acceso actualizado exitosamente.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Token de actualización inválido o expirado.',
  })
  @ApiBody({ type: AuthRefreshDto })
  @UsePipes(new ValidationPipe())
  async refresh(@Body() authRefreshDto: AuthRefreshDto) {
    return this.authService.refresh(authRefreshDto);
  }
}
