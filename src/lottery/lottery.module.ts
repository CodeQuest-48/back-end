import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryController } from './lottery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sorteo } from './entities/sorteo.entity';

@Module({
  controllers: [LotteryController],
  imports: [TypeOrmModule.forFeature([Sorteo])],
  providers: [LotteryService],
  exports: [TypeOrmModule],
})
export class LotteryModule {}
