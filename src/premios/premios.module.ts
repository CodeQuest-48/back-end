import { Module } from '@nestjs/common';
import { PremiosService } from './premios.service';
import { PremiosController } from './premios.controller';

@Module({
  controllers: [PremiosController],
  providers: [PremiosService],
})
export class PremiosModule {}
