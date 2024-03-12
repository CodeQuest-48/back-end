import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { validate as uuidValidate } from 'uuid';

import { LoginUserDto } from './dto/login-user.dto';
import { Usuario } from './entities/user.entity';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtPayload } from './interfaces/jwt-patload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly userRepository: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        email: true,
        password: true,
        id: true,
        nombre: true,
        rol: true,
      },
    });

    if (!user)
      throw new UnauthorizedException('Credenciales no son válidas (Email)');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException(
        'Credenciales no son válidas (Contraseña)',
      );

    return {
      email: user.email,
      nombre: user.nombre,
      token: this.getJwtToken({ id: user.id }),
      rol: user.rol,
    };
  }

  async register(registerUserDto: RegisterUserDto) {
    try {
      const { password, ...userData } = registerUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      await this.userRepository.save(user);
      delete user.password;

      return {
        ...user,
        token: this.getJwtToken({ id: user.id }),
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  async checkAuthStatus(usuario: Usuario) {
    return {
      email: usuario.email,
      nombre: usuario.nombre,
      token: this.getJwtToken({ id: usuario.id }),
      rol: usuario.rol,
    };
  }

  async findAllUsuarios() {
    const users = await this.userRepository.find({
      select: ['id', 'nombre', , 'email', 'rol'],
    });

    return users;
  }

  /* ********************************** */
  /*          Obtener TOKEN JWT         */
  /* ********************************** */
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);

    return token;
  }

  // Manejar los errores
  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);
    if (error.status === 404)
      throw new NotFoundException(error.response.message);
    console.log(error);

    throw new InternalServerErrorException('Algo salió mal, Revisa los logs');
  }
}
