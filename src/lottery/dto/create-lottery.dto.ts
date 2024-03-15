import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateLotteryDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}
