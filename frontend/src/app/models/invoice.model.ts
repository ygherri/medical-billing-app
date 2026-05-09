import { Patient } from './patient.model';

export type PaymentMethod = 'CASH' | 'CARD' | 'CHECK' | 'BANK_TRANSFER';

export type CoverageType = 'STANDARD' | 'C2S' | 'ALD' | 'AME' | 'MATERNITY' | 'WORK_ACCIDENT';

export interface Invoice {
  id: string;
  amount: string;
  paymentMethod: PaymentMethod;
  coverageType: CoverageType;
  billingDate: string;
  notes?: string;
  patientId: string;
  patient?: Patient;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInvoiceDto {
  amount: number;
  paymentMethod: PaymentMethod;
  coverageType: CoverageType;
  billingDate: string;
  patientId: string;
  notes?: string;
}

export interface DailyBillingSummary {
  date: string;
  invoiceCount: number;
  totalAmount: number;
  paymentMethods: Record<string, number>;
  coverageTypes: Record<string, number>;
  invoices: Invoice[];
}
