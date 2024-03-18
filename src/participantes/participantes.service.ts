import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participante } from './entities/participante.entity';
import { Repository } from 'typeorm';
import { Sorteo } from 'src/lottery/entities/sorteo.entity';

@Injectable()
export class ParticipantesService {
  constructor(
    @InjectRepository(Participante)
    private participanteRepository: Repository<Participante>,
    @InjectRepository(Sorteo)
    private sorteoRepository: Repository<Sorteo>,
  ) {}

  create(createParticipanteDto: CreateParticipanteDto) {
    return 'This action adds a new participante';
  }

  findAll() {
    return this.participanteRepository.find();
  }

  async findAllBySorteoId(sorteoId: string): Promise<Participante[]> {
    // Primero, verifica que el sorteo existe
    const sorteo = await this.sorteoRepository.findOne({
      where: { id: sorteoId },
      relations: ['participantes'],
    });
    if (!sorteo) {
      throw new NotFoundException(`Sorteo con ID "${sorteoId}" no encontrado`);
    }

    return sorteo.participantes;
  }

  findOne(id: number) {
    return `This action returns a #${id} participante`;
  }

  update(id: number, updateParticipanteDto: UpdateParticipanteDto) {
    return `This action updates a #${id} participante`;
  }

  remove(id: number) {
    return `This action removes a #${id} participante`;
  }
}
