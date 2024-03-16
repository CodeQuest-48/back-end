import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';
import { Premio } from './entities/premio.entity';
import { Usuario } from 'src/auth/entities/user.entity';
import { Sorteo } from 'src/lottery/entities/sorteo.entity';

@Injectable()
export class PremiosService {
  private readonly logger = new Logger('PremiosService');

  constructor(
    @InjectRepository(Premio)
    private readonly premiosRepository: Repository<Premio>,

    private readonly datasource: DataSource,
  ) {}

  async create(
    createPremioDto: CreatePremioDto,
    sorteoId: string,
    usuario: Usuario,
  ) {
    try {
      await this.validationsSorteo(sorteoId, usuario);

      const premio = this.premiosRepository.create({
        ...createPremioDto,
        sorteo: { id: sorteoId },
      });

      await this.premiosRepository.save(premio);

      return premio;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(sorteoId: string, usuario: Usuario) {
    await this.validationsSorteo(sorteoId, usuario);

    const premios = await this.premiosRepository.find({
      where: { sorteo: { id: sorteoId } },
    });
    return premios;
  }

  async findOne(term: string) {
    let premio: Premio;

    if (isUUID(term)) {
      premio = await this.premiosRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.premiosRepository.createQueryBuilder('premio');

      premio = await queryBuilder
        .where('UPPER(title) =:title', {
          title: term.toUpperCase(),
        })
        .getOne();
    }

    if (!premio)
      throw new NotFoundException(
        `Premio con termino => ${term} no encontrado`,
      );
    return premio;
  }

  async update(id: string, updatePremioDto: UpdatePremioDto) {
    const premio = await this.premiosRepository.preload({
      id,
      ...updatePremioDto,
    });

    if (!premio)
      throw new NotFoundException(`Premio con id => ${id} no encontrado`);

    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(premio);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.logger.error(error.message);
    }
  }

  async remove(id: string) {
    const premio = await this.findOne(id);
    await this.premiosRepository.remove(premio);
    return 'Premio borrado exitosamente';
  }

  /* ********************************** */
  /*            VALIDACIONES            */
  /* ********************************** */
  // Método reutilizable para validar permisos y si existe un sorteo
  private async validationsSorteo(sorteoId: string, usuario: Usuario) {
    // Validar si el sorteoId es un UUID
    if (!isUUID(sorteoId))
      throw new BadRequestException(`El id proporcionado no es un UUID válido`);

    // Validar que el sorteo exista
    const sorteo = await this.datasource
      .getRepository(Sorteo)
      .findOne({ where: { id: sorteoId }, relations: ['creador'] });

    if (!sorteo)
      throw new NotFoundException(`Sorteo con id => ${sorteoId} no encontrado`);

    // Validar que el usuario sea el creador del sorteo
    if (sorteo.creador.id !== usuario.id)
      throw new UnauthorizedException(
        `Usuario no autorizado para realizar esta acción`,
      );
  }

  // Manejar los errores
  private handleError(error: Error) {
    this.logger.error(error.message);

    // Verifica si el error es una instancia de las excepciones de NestJS
    if (error instanceof HttpException) {
      throw error;
    } else {
      // Para cualquier otro tipo de error, lanza un mensaje genérico
      throw new InternalServerErrorException('Algo salió mal, revisa los logs');
    }
  }
}
