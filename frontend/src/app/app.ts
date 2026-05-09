import { Component, signal, OnInit, inject } from '@angular/core';
import { MedicalBillingApiService } from './services/medical-billing-api.service';
import { Patient } from './models/patient.model';
import { FormsModule } from '@angular/forms';
import {
  CoverageType,
  CreateInvoiceDto,
  Invoice,
  PaymentMethod,
  DailyBillingSummary,
} from './models/invoice.model';



@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly medicalBillingApi = inject(MedicalBillingApiService);
  onCoverageTypeChange(coverageType: CoverageType): void {
    this.invoiceCoverageType.set(coverageType);
  }

  patients = signal<Patient[]>([]);
  invoices = signal<Invoice[]>([]);
  dailySummary = signal<DailyBillingSummary | null>(null);
  selectedSummaryDate = signal(new Date().toISOString().slice(0, 10));
  isLoadingSummary = signal(false);
  summaryError = signal<string | null>(null);

  isLoadingPatients = signal(false);
  isLoadingInvoices = signal(false);

  patientsError = signal<string | null>(null);
  invoicesError = signal<string | null>(null);

  newPatientFirstName = signal('');
  newPatientLastName = signal('');
  isCreatingPatient = signal(false);
  createPatientError = signal<string | null>(null);
  createPatientSuccess = signal<string | null>(null);

  invoicePatientId = signal('');
  invoiceAmount = signal<number | null>(null);
  invoicePaymentMethod = signal<PaymentMethod>('CARD');
  invoiceCoverageType = signal<CoverageType>('STANDARD');
  invoiceBillingDate = signal(new Date().toISOString().slice(0, 10));
  invoiceNotes = signal('');

  isCreatingInvoice = signal(false);
  createInvoiceError = signal<string | null>(null);
  createInvoiceSuccess = signal<string | null>(null);

  paymentMethods: { value: PaymentMethod; label: string }[] = [
    { value: 'CARD', label: 'Carte bancaire' },
    { value: 'CASH', label: 'Espèces' },
    { value: 'CHECK', label: 'Chèque' },
    { value: 'BANK_TRANSFER', label: 'Virement' },
  ];

  coverageTypes: { value: CoverageType; label: string }[] = [
    { value: 'STANDARD', label: 'Classique' },
    { value: 'C2S', label: 'C2S' },
    { value: 'ALD', label: 'ALD' },
    { value: 'AME', label: 'AME' },
    { value: 'MATERNITY', label: 'Maternité' },
    { value: 'WORK_ACCIDENT', label: 'Accident de travail' },
  ];

  ngOnInit(): void {
    this.loadPatients();
    this.loadInvoices();
    this.loadDailySummary();
  }

  loadPatients(): void {
    this.isLoadingPatients.set(true);
    this.patientsError.set(null);

    this.medicalBillingApi.getPatients().subscribe({
      next: (patients) => {
        this.patients.set(patients);
        this.isLoadingPatients.set(false);
      },
      error: () => {
        this.patientsError.set(
          'Impossible de charger les patients. Vérifiez que le backend est bien lancé.',
        );
        this.isLoadingPatients.set(false);
      },
    });
  }
  loadInvoices(): void {
    this.isLoadingInvoices.set(true);
    this.invoicesError.set(null);

    this.medicalBillingApi.getInvoices().subscribe({
      next: (invoices) => {
        this.invoices.set(invoices);
        this.isLoadingInvoices.set(false);
      },
      error: () => {
        this.invoicesError.set(
          'Impossible de charger les factures. Vérifiez que le backend est bien lancé.',
        );
        this.isLoadingInvoices.set(false);
      },
    });
  }
  loadDailySummary(): void {
    this.isLoadingSummary.set(true);
    this.summaryError.set(null);

    this.medicalBillingApi.getDailySummary(this.selectedSummaryDate()).subscribe({
      next: (summary) => {
        this.dailySummary.set(summary);
        this.isLoadingSummary.set(false);
      },
      error: () => {
        this.summaryError.set(
          'Impossible de charger le résumé journalier. Vérifiez que le backend est bien lancé.',
        );
        this.isLoadingSummary.set(false);
      },
    });
  }
  createPatient(): void {
    const firstName = this.newPatientFirstName().trim();
    const lastName = this.newPatientLastName().trim();

    this.createPatientError.set(null);
    this.createPatientSuccess.set(null);

    if (!firstName || !lastName) {
      this.createPatientError.set('Veuillez renseigner le prénom et le nom du patient.');
      return;
    }

    this.isCreatingPatient.set(true);

    this.medicalBillingApi
      .createPatient({
        firstName,
        lastName,
      })
      .subscribe({
        next: () => {
          this.newPatientFirstName.set('');
          this.newPatientLastName.set('');
          this.isCreatingPatient.set(false);
          this.createPatientSuccess.set('Patient ajouté avec succès.');
          this.loadPatients();
          setTimeout(() => {
            this.createPatientSuccess.set(null);
          }, 3000);
        },
        error: () => {
          this.createPatientError.set(
            'Impossible d’ajouter le patient. Vérifiez que le backend est bien lancé.',
          );
          this.isCreatingPatient.set(false);
        },
      });
  }
  createInvoice(): void {
    const patientId = this.invoicePatientId();
    const amount = Number(this.invoiceAmount());
    const billingDate = this.invoiceBillingDate();
    const coverageType = this.invoiceCoverageType();

    this.createInvoiceError.set(null);
    this.createInvoiceSuccess.set(null);

    if (!patientId) {
      this.createInvoiceError.set('Veuillez sélectionner un patient.');
      return;
    }

    if (!amount || amount <= 0) {
      this.createInvoiceError.set('Veuillez saisir un montant valide.');
      return;
    }

    if (!billingDate) {
      this.createInvoiceError.set('Veuillez sélectionner une date de facturation.');
      return;
    }

    if (coverageType === 'STANDARD' && !this.invoicePaymentMethod()) {
      this.createInvoiceError.set('Veuillez sélectionner un mode de paiement.');
      return;
    }

    const invoicePayload: CreateInvoiceDto = {
      patientId,
      amount,
      coverageType,
      billingDate,
      notes: this.invoiceNotes().trim() || undefined,
      paymentMethod: coverageType === 'STANDARD' ? this.invoicePaymentMethod() : null,
    };

    this.isCreatingInvoice.set(true);

    this.medicalBillingApi.createInvoice(invoicePayload).subscribe({
      next: () => {
        this.invoiceAmount.set(null);
        this.invoiceNotes.set('');
        this.isCreatingInvoice.set(false);
        this.createInvoiceError.set(null);
        this.createInvoiceSuccess.set('Facture ajoutée avec succès.');
        this.loadInvoices();
        this.loadDailySummary();

        setTimeout(() => {
          this.createInvoiceSuccess.set(null);
        }, 3000);
      },
      error: () => {
        this.createInvoiceError.set(
          'Impossible d’ajouter la facture. Vérifiez que le backend est bien lancé.',
        );
        this.isCreatingInvoice.set(false);
      },
    });
  }

  getPaymentMethodLabel(method?: PaymentMethod | null): string {
    if (!method) {
      return '';
    }
    return (
      this.paymentMethods.find((paymentMethod) => paymentMethod.value === method)?.label ?? method
    );
  }

  getCoverageTypeLabel(type: CoverageType): string {
    return this.coverageTypes.find((coverageType) => coverageType.value === type)?.label ?? type;
  }
  getPaymentSummaryEntries(): { label: string; amount: number }[] {
    const summary = this.dailySummary();

    if (!summary) {
      return [];
    }

    return Object.entries(summary.paymentMethods).map(([method, amount]) => ({
      label: this.getPaymentMethodLabel(method as PaymentMethod),
      amount,
    }));
  }

  getCoverageSummaryEntries(): { label: string; count: number }[] {
    const summary = this.dailySummary();

    if (!summary) {
      return [];
    }

    return Object.entries(summary.coverageTypes).map(([type, count]) => ({
      label: this.getCoverageTypeLabel(type as CoverageType),
      count,
    }));
  }
  formatDate(date: string): string {
    return new Intl.DateTimeFormat('fr-FR').format(new Date(date));
  }
}
