import { Component, signal, OnInit, inject } from '@angular/core';
import { MedicalBillingApiService } from './services/medical-billing-api.service';
import { Patient } from './models/patient.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly medicalBillingApi = inject(MedicalBillingApiService);

  patients = signal<Patient[]>([]);
  isLoadingPatients = signal(false);
  patientsError = signal<string | null>(null);

  newPatientFirstName = signal('');
  newPatientLastName = signal('');
  isCreatingPatient = signal(false);
  createPatientError = signal<string | null>(null);
  createPatientSuccess = signal<string | null>(null);

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
}
