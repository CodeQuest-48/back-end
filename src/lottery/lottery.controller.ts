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
import { Lottery } from './entities/lottery.entity';

@Controller('lottery')
export class LotteryController {
  constructor(private readonly lotteryService: LotteryService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Lottery created succesfully',
    type: Lottery,
  })
  create(@Body() createLotteryDto: CreateLotteryDto) {
    return this.lotteryService.create(createLotteryDto);
  }

  @Get()
  findAll() {
    return this.lotteryService.findAll();
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.lotteryService.findOne(term);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLotteryDto: UpdateLotteryDto) {
    return this.lotteryService.update(id, updateLotteryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.lotteryService.remove(id);
  }
}
