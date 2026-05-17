import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CoverageType, PaymentMethod } from '@prisma/client';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';

export class CreateInvoiceDto {
  @ApiProperty({
    example: 25,
    description: 'Montant de la facture',
  })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiPropertyOptional({
    enum: PaymentMethod,
    example: PaymentMethod.CARD,
    description:
      'Mode de paiement obligatoire uniquement pour une prise en charge classique',
  })
  @ValidateIf((invoice) => invoice.coverageType === CoverageType.STANDARD)
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod | null;

  @ApiProperty({
    enum: CoverageType,
    example: CoverageType.STANDARD,
    description: 'Type de prise en charge',
  })
  @IsEnum(CoverageType)
  coverageType!: CoverageType;

  @ApiProperty({
    example: '2026-05-17',
    description: 'Date de facturation',
  })
  @IsDateString()
  billingDate!: string;

  @ApiProperty({
    example: 'clx123patientid',
    description: 'Identifiant du patient associé à la facture',
  })
  @IsString()
  @IsNotEmpty()
  patientId!: string;

  @ApiPropertyOptional({
    example: 'Consultation réglée par carte',
    description: 'Note facultative',
  })
  @IsOptional()
  @IsString()
  notes?: string;
}
