import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PremiosService } from './premios.service';
import { CreatePremioDto } from './dto/create-premio.dto';
import { UpdatePremioDto } from './dto/update-premio.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Usuario } from 'src/auth/entities/user.entity';

@Auth(ValidRoles.admin)
@ApiTags('premios')
@Controller('premios/:sorteoId')
export class PremiosController {
  constructor(private readonly premiosService: PremiosService) {}

  @Post('new')
  create(
    @Body() createPremioDto: CreatePremioDto,
    @Param('sorteoId') sorteoId: string,
    @GetUser() usuario: Usuario,
  ) {
    return this.premiosService.create(createPremioDto, sorteoId, usuario);
  }

  // Asignar ganador a un premio
  @Post(':premioId/asignar-ganador/:participanteId')
  asignarGanador(
    @Param('premioId') premioId: string,
    @Param('participanteId') participanteId: string,
  ) {
    return this.premiosService.asignarGanador(premioId, participanteId);
  }

  @Get()
  findAll(@Param('sorteoId') sorteoId: string, @GetUser() usuario: Usuario) {
    return this.premiosService.findAll(sorteoId, usuario);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.premiosService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePremioDto: UpdatePremioDto) {
    return this.premiosService.update(id, updatePremioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.premiosService.remove(id);
  }
}
