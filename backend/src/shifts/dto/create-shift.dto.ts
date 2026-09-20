import {
  IsDateString,
  IsInt,
  IsOptional,
  IsEnum,
} from 'class-validator';

enum ShiftStatus {
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class CreateShiftDto {
  @IsInt()
  userId!: number;

  @IsDateString()
  startTime!: string;

  @IsDateString()
  endTime!: string;

  @IsOptional()
  @IsEnum(ShiftStatus)
  status?: ShiftStatus;
}
