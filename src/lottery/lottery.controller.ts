import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LotteryService } from './lottery.service';
import { CreateLotteryDto } from './dto/create-lottery.dto';
import { UpdateLotteryDto } from './dto/update-lottery.dto';

import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Sorteo } from './entities/sorteo.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces/valid-roles';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { Usuario } from 'src/auth/entities/user.entity';

@ApiTags('sorteos')
@Auth(ValidRoles.admin)
@Controller('sorteos')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Post('new')
  @ApiResponse({
    status: 201,
    description: 'Lottery created succesfully',
    type: Sorteo,
  })
  create(
    @Body() createLotteryDto: CreateLotteryDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.lotteryService.create(createLotteryDto, usuario);
  }

  @Get()
  findAll() {
    return this.lotteryService.findAll();
  }

  @Patch(':id/asignar-ganador/:participanteId')
  asignarGanador(
    @Param('id') sorteoId: string,
    @Param('participanteId') participanteId: string,
  ) {
    return this.lotteryService.asignarGanadorAlSorteo(sorteoId, participanteId);
  }

  @Get(':term')
  findOne(@Param('term') term: string, @GetUser() usuario: Usuario) {
    return this.lotteryService.findOne(term, usuario);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLotteryDto: UpdateLotteryDto,
    @GetUser() usuario: Usuario,
  ) {
    return this.lotteryService.update(id, updateLotteryDto, usuario);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @GetUser() usuario: Usuario) {
    return this.lotteryService.remove(id, usuario);
  }
}
