import { Injectable } from '@nestjs/common';
import { CreateParticipanteDto } from './dto/create-participante.dto';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Participante } from './entities/participante.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParticipantesService {
  constructor(
    @InjectRepository(Participante)
    private participanteRepository: Repository<Participante>,
  ) {}

  create(createParticipanteDto: CreateParticipanteDto) {
    return 'This action adds a new participante';
  }

  findAll() {
    return this.participanteRepository.find();
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
