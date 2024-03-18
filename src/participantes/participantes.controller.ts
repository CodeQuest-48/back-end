import { Controller, Get, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParticipantesService } from './participantes.service';
import { UpdateParticipanteDto } from './dto/update-participante.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { ApiTags } from '@nestjs/swagger';

@Auth(ValidRoles.admin)
@ApiTags('Participantes')
@Controller('participantes')
export class ParticipantesController {
  constructor(private readonly participantesService: ParticipantesService) {}

  @Get()
  findAll() {
    return this.participantesService.findAll();
  }

  // Obtener todos los participantes de un sorteo
  @Get('sorteo/:sorteoId')
  findAllBySorteoId(@Param('sorteoId') sorteoId: string) {
    return this.participantesService.findAllBySorteoId(sorteoId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participantesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateParticipanteDto: UpdateParticipanteDto,
  ) {
    return this.participantesService.update(+id, updateParticipanteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participantesService.remove(+id);
  }
}
