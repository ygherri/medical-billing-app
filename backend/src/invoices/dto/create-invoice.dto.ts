import { CoverageType, PaymentMethod } from '@prisma/client';

export class CreateInvoiceDto {
  amount!: number;
  paymentMethod?: PaymentMethod | null;
  coverageType!: CoverageType;
  billingDate!: string;
  patientId!: string;
  notes?: string;
}
