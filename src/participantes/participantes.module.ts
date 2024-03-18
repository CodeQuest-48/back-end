import { Module, forwardRef } from '@nestjs/common';
import { ParticipantesService } from './participantes.service';
import { ParticipantesController } from './participantes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Participante } from './entities/participante.entity';
import { LotteryModule } from 'src/lottery/lottery.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ParticipantesController],
  providers: [ParticipantesService],
  imports: [
    TypeOrmModule.forFeature([Participante]),
    forwardRef(() => LotteryModule),
    forwardRef(() => AuthModule),
  ],
  exports: [TypeOrmModule],
})
export class ParticipantesModule {}
