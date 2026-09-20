import {
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateAvailabilityDto {
  @IsISO8601()
  date: string;

  @IsBoolean()
  available: boolean;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}