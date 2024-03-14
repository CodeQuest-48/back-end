import { Module } from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { LotteryController } from './lottery.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lottery } from './entities/lottery.entity';

@Module({
  controllers: [LotteryController],
  imports: [TypeOrmModule.forFeature([Lottery])],
  providers: [LotteryService],
  exports: [TypeOrmModule],
})
export class LotteryModule {}
