import { Module } from '@nestjs/common';
import { PremiosService } from './premios.service';
import { PremiosController } from './premios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Premio } from './entities/premio.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ParticipantesModule } from 'src/participantes/participantes.module';

@Module({
  controllers: [PremiosController],
  providers: [PremiosService],
  imports: [
    TypeOrmModule.forFeature([Premio]),
    AuthModule,
    ParticipantesModule,
  ],
  exports: [TypeOrmModule],
})
export class PremiosModule {}
