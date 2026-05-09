import { Component, signal, OnInit, inject } from '@angular/core';
import { MedicalBillingApiService } from './services/medical-billing-api.service';
import { Patient } from './models/patient.model';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly medicalBillingApi = inject(MedicalBillingApiService);

  patients = signal<Patient[]>([]);
  isLoadingPatients = signal(false);
  patientsError = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPatients();
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
}
