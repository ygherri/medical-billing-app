import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    example: 'Sarah',
  })
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @ApiProperty({
    example: 'Martin',
  })
  @IsString()
  @IsNotEmpty()
  lastName!: string;
}
