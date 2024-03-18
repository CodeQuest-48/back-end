import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { UpdateLotteryDto } from './dto/update-lottery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Sorteo } from './entities/sorteo.entity';
import { Usuario } from 'src/auth/entities/user.entity';
import { Participante } from 'src/participantes/entities/participante.entity';

@Injectable()
export class LotteryService {
  private readonly logger = new Logger('LotteryService');

  constructor(
    @InjectRepository(Sorteo)
    private readonly sorteoRepository: Repository<Sorteo>,
    @InjectRepository(Participante)
    private readonly participanteRepository: Repository<Participante>,

    private readonly datasource: DataSource,
  ) {}

  async create(createLotteryDto: CreateLotteryDto, usuario: Usuario) {
    try {
      const lottery = this.sorteoRepository.create({
        ...createLotteryDto,
        creador: usuario,
      });
      await this.sorteoRepository.save(lottery);
      return lottery;
    } catch (error) {
      this.logger.error(error.message);
      throw new Error('Ha ocurrido un error creando el sorteo');
    }
  }

  async findAll() {
    const lotteries = await this.sorteoRepository.find({
      relations: ['creador', 'participantes', 'premios', 'ganador'],
    });
    return lotteries;
  }

  async findOne(term: string, usuario: Usuario) {
    let lottery: Sorteo;

    if (isUUID(term)) {
      lottery = await this.sorteoRepository.findOne({
        where: { id: term },
        relations: ['creador', 'participantes', 'premios', 'ganador'],
      });
    } else {
      const queryBuilder = this.sorteoRepository.createQueryBuilder('lott');

      lottery = await queryBuilder
        .where('UPPER(title) =:title', {
          title: term.toUpperCase(),
        })
        .leftJoinAndSelect('sorteo.creador', 'creador')
        .leftJoinAndSelect('sorteo.participantes', 'participantes')
        .getOne();
    }

    if (!lottery)
      throw new NotFoundException(`Lottery with term ${term} not found`);
    return lottery;
  }

  async update(
    id: string,
    updateLotteryDto: UpdateLotteryDto,
    usuario: Usuario,
  ) {
    const lottery = await this.sorteoRepository.preload({
      id,
      ...updateLotteryDto,
    });

    if (!lottery)
      throw new NotFoundException(`Lottery with id ${id} not found`);

    const queryRunner = this.datasource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.save(lottery);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOne(id, usuario);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.logger.error(error.message);
    }
  }

  async remove(id: string, usuario: Usuario) {
    const lottery = await this.findOne(id, usuario);
    await this.sorteoRepository.remove(lottery);
    return 'Lottery deleted succesfully';
  }

  // ASIGNAR GANADOR A UN SORTEO - PREMIO INDIVIDUAL
  async asignarGanadorAlSorteo(
    sorteoId: string,
    participanteId: string,
  ): Promise<Sorteo> {
    const sorteo = await this.sorteoRepository.findOne({
      where: { id: sorteoId },
      relations: ['participantes'],
    });
    if (!sorteo) {
      throw new Error('Sorteo no encontrado');
    }

    const ganador = await this.participanteRepository.findOneBy({
      id: participanteId,
    });
    if (!ganador) {
      throw new Error('Participante no encontrado');
    }

    // Opcional: Verificar si el participante está inscrito en el sorteo.
    const estaInscrito = sorteo.participantes.some(
      (participante) => participante.id === ganador.id,
    );
    if (!estaInscrito) {
      throw new Error('El participante no está inscrito en el sorteo');
    }

    sorteo.ganador = ganador; // Asigna el ganador al sorteo.
    await this.sorteoRepository.save(sorteo); // Guarda los cambios en la base de datos.

    return sorteo;
  }
}
