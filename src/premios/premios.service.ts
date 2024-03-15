import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Premio } from './entities/premio.entity';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class PremiosService {
  private readonly logger = new Logger('PremiosService');

  constructor(
    @InjectRepository(Premio)
    private readonly premiosRepository: Repository<Premio>,
    private readonly datasource: DataSource,
  ) {}

  async create(createPremioDto: CreatePremioDto) {
    try {
      const premio = this.premiosRepository.create({ ...createPremioDto });
      await this.premiosRepository.save(premio);
      return premio;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async findAll() {
    return await this.premiosRepository.find();
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
      throw new NotFoundException(`Premio con termino => ${term} no encontrado`);
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
}
