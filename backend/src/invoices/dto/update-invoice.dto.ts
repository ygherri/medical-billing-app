import { CoverageType, PaymentMethod } from '@prisma/client';

export class UpdateInvoiceDto {
  amount?: number;
  paymentMethod?: PaymentMethod | null;
  coverageType?: CoverageType;
  billingDate?: string;
  patientId?: string;
  notes?: string;
}
