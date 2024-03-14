import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { UpdateLotteryDto } from './dto/update-lottery.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Lottery } from './entities/lottery.entity';
import { DataSource, Repository } from 'typeorm';
import { isUUID } from 'class-validator';

@Injectable()
export class LotteryService {
  private readonly logger = new Logger('LotteryService');

  constructor(
    @InjectRepository(Lottery)
    private readonly lotteryRepository: Repository<Lottery>,

    private readonly datasource: DataSource,
  ) {}

  async create(createLotteryDto: CreateLotteryDto) {
    try {
      const lottery = this.lotteryRepository.create({ ...createLotteryDto });
      await this.lotteryRepository.save(lottery);
      return lottery;
    } catch (error) {
      this.logger.error(error.message);
    }
  }

  async findAll() {
    const lotteries = await this.lotteryRepository.find();
    return lotteries;
  }

  async findOne(term: string) {
    let lottery: Lottery;

    if (isUUID(term)) {
      lottery = await this.lotteryRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.lotteryRepository.createQueryBuilder('lott');

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
    const lottery = await this.lotteryRepository.preload({
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
    await this.lotteryRepository.remove(lottery);
    return 'Lottery deleted succesfully';
  }
}
