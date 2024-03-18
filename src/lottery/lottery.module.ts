import { Module, forwardRef } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryController } from './lottery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sorteo } from './entities/sorteo.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ParticipantesModule } from 'src/participantes/participantes.module';

@Module({
  controllers: [LotteryController],
  imports: [
    TypeOrmModule.forFeature([Sorteo]),
    forwardRef(() => AuthModule),
    forwardRef(() => ParticipantesModule),
  ],
  providers: [LotteryService],
  exports: [TypeOrmModule],
})
export class LotteryModule {}
