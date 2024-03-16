import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { UpdateLotteryDto } from './dto/update-lottery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';
import { Sorteo } from './entities/sorteo.entity';
import { Usuario } from 'src/auth/entities/user.entity';

@Injectable()
export class LotteryService {
  private readonly logger = new Logger('LotteryService');

  constructor(
    @InjectRepository(Sorteo)
    private readonly sorteoRepositorio: Repository<Sorteo>,

    private readonly datasource: DataSource,
  ) {}

  async create(createLotteryDto: CreateLotteryDto, usuario: Usuario) {
    try {
      const lottery = this.sorteoRepositorio.create({
        ...createLotteryDto,
        creador: usuario,
      });
      await this.sorteoRepositorio.save(lottery);
      return lottery;
    } catch (error) {
      this.logger.error(error.message);
      throw new Error('Ha ocurrido un error creando el sorteo');
    }
  }

  async findAll() {
    const lotteries = await this.sorteoRepositorio.find({
      relations: ['creador', 'participantes'],
    });
    return lotteries;
  }

  async findOne(term: string) {
    let lottery: Sorteo;

    if (isUUID(term)) {
      lottery = await this.sorteoRepositorio.findOneBy({ id: term });
    } else {
      const queryBuilder = this.sorteoRepositorio.createQueryBuilder('lott');

      lottery = await queryBuilder
        .where('UPPER(title) =:title', {
          title: term.toUpperCase(),
        })
        .getOne();
    }

    if (!lottery)
      throw new NotFoundException(`Lottery with term ${term} not found`);
    return lottery;
  }

  async update(id: string, updateLotteryDto: UpdateLotteryDto) {
    const lottery = await this.sorteoRepositorio.preload({
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

      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.logger.error(error.message);
    }
  }

  async remove(id: string) {
    const lottery = await this.findOne(id);
    await this.sorteoRepositorio.remove(lottery);
    return 'Lottery deleted succesfully';
  }
}
