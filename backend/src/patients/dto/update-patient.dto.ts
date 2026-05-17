import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePatientDto {
  @ApiPropertyOptional({
    example: 'Sarah',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    example: 'Martin',
  })
  @IsOptional()
  @IsString()
  lastName?: string;
}
