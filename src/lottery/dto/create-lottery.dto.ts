import { IsDate, IsDateString, IsString, MinLength } from 'class-validator';

export class CreateLotteryDto {
  @IsString()
  @MinLength(1)
  title: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsDate()
  @IsDateString()
  startDate: Date;

  @IsDate()
  @IsDateString()
  endDate: Date;
}
