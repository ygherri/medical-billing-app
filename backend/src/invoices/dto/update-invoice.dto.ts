import { CoverageType, PaymentMethod } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateInvoiceDto {
  @ApiPropertyOptional({
    example: 25,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  amount?: number;

  @ApiPropertyOptional({
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
  })
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod | null;

  @ApiPropertyOptional({
    enum: CoverageType,
    example: CoverageType.STANDARD,
  })
  @IsOptional()
  @IsEnum(CoverageType)
  coverageType?: CoverageType;

  @ApiPropertyOptional({
    example: '2026-05-17',
  })
  @IsOptional()
  @IsDateString()
  billingDate?: string;

  @ApiPropertyOptional({
    example: 'clx123patientid',
  })
  @IsOptional()
  @IsString()
  patientId?: string;

  @ApiPropertyOptional({
    example: 'Consultation réglée par carte',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
