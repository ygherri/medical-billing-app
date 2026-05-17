import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateInvoiceDto, DailyBillingSummary, Invoice } from '../models/invoice.model';
import { CreatePatientDto, Patient } from '../models/patient.model';

@Injectable({
  providedIn: 'root',
})
export class MedicalBillingApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'https://medical-billing-app-zxko.onrender.com';

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
  }

  createPatient(patient: CreatePatientDto): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/patients`, patient);
  }

  deletePatient(id: string): Observable<Patient> {
    return this.http.delete<Patient>(`${this.apiUrl}/patients/${id}`);
  }

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.apiUrl}/invoices`);
  }

  createInvoice(invoice: CreateInvoiceDto): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/invoices`, invoice);
  }

  deleteInvoice(id: string): Observable<Invoice> {
    return this.http.delete<Invoice>(`${this.apiUrl}/invoices/${id}`);
  }

  getDailySummary(date: string): Observable<DailyBillingSummary> {
    return this.http.get<DailyBillingSummary>(`${this.apiUrl}/invoices/summary/daily?date=${date}`);
  }
}
