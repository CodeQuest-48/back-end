import { Module } from '@nestjs/common';
import { PremiosService } from './premios.service';
import { PremiosController } from './premios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Premio } from './entities/premio.entity';

@Module({
  controllers: [PremiosController],
  providers: [PremiosService],
  imports: [TypeOrmModule.forFeature([Premio])],
  exports: [TypeOrmModule],
})
export class PremiosModule {}
