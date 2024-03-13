import { Module } from '@nestjs/common';
import { ParticipantesService } from './participantes.service';
import { ParticipantesController } from './participantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participante } from './entities/participante.entity';

@Module({
  controllers: [ParticipantesController],
  providers: [ParticipantesService],
  imports: [TypeOrmModule.forFeature([Participante])],
  exports: [TypeOrmModule],
})
export class ParticipantesModule {}
