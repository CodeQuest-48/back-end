import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { RawHeaders } from './decorators/raw-headers.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { Usuario } from './entities/user.entity';
import { ValidRoles } from './interfaces/valid-roles';
import { Auth } from './decorators/auth.decorator';

@ApiTags('Autenticación')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiResponse({
    status: 200,
    description: 'Usuario autenticado',
  })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Post('register')
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: Usuario,
  })
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto);
  }

  @Get('check-auth-status')
  @Auth()
  checkAuthStatus(@GetUser() usuario: Usuario) {
    return this.authService.checkAuthStatus(usuario);
  }

  @Get('usuarios')
  @Auth(ValidRoles.admin)
  findAllUsuarios() {
    return this.authService.findAllUsuarios();
  }

  // Método de Prueba, IGNORAR
  @Get('private3')
  @Auth(ValidRoles.admin)
  testingPrivateRoute3(
    @GetUser() user: Usuario,
    @RawHeaders() rawHeaders: string[],
  ) {
    return {
      ok: true,
      user,
      rawHeaders,
    };
  }
}
