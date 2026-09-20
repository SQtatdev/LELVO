import {
  IsBoolean,
  IsISO8601,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateAvailabilityDto {
  @IsOptional()
  @IsISO8601()
  date?: string;

  @IsOptional()
  @IsBoolean()
  available?: boolean;

  @IsOptional()
  @IsString()
  startTime?: string;

  @IsOptional()
  @IsString()
  endTime?: string;
}