# Medi-Billing 🩺

Medi-Billing est une application web fullstack développée avec Angular, NestJS, Prisma et PostgreSQL.

Elle permet de gérer la facturation quotidienne d’un cabinet médical : gestion des patients, création de factures, suivi des encaissements et affichage d’un résumé journalier.

## 🚀 Démo en ligne

Application frontend :  
https://medical-billing-web.netlify.app

API backend :  
https://medical-billing-app-zxko.onrender.com

## ✨ Fonctionnalités

- Tableau de bord de facturation médicale
- Gestion des patients
- Ajout et suppression de patients
- Création de factures liées à un patient
- Gestion des prises en charge :
  - Classique
  - C2S
  - ALD
  - AME
  - Maternité
  - Accident de travail
- Affichage du mode de paiement uniquement pour une prise en charge classique
- Gestion des modes de paiement :
  - Carte bancaire
  - Espèces
  - Chèque
  - Virement
- Résumé journalier des encaissements
- Répartition des factures par type de prise en charge
- Navigation par section avec une sidebar
- Interface responsive

## 🛠️ Technologies utilisées

### Frontend

- Angular
- TypeScript
- Angular Signals
- Angular Forms
- HttpClient
- SCSS
- Remix Icon

### Backend

- NestJS
- TypeScript
- Prisma
- PostgreSQL
- API REST

### Déploiement

- Netlify
- Render
- Neon PostgreSQL

## 📦 Installation en local

Cloner le projet :

```bash
git clone https://github.com/ygherri/medical-billing-app.git
```

Accéder au dossier :

```bash
cd medical-billing-app
```

## ⚙️ Backend

Accéder au dossier backend :

```bash
cd backend
```

Installer les dépendances :

```bash
npm install
```

Créer un fichier `.env` dans le dossier `backend`.

Ce fichier doit contenir la variable de connexion à la base de données :

```env
DATABASE_URL="VOTRE_URL_DE_CONNEXION_POSTGRESQL"
```

Le fichier `.env` contient des informations sensibles et ne doit pas être envoyé sur GitHub.

Lancer les migrations Prisma :

```bash
npx prisma migrate dev
```

Générer le client Prisma :

```bash
npx prisma generate
```

Lancer le backend :

```bash
npm run start:dev
```

Le backend sera disponible sur :

```bash
http://localhost:3000
```

## 💻 Frontend

Depuis la racine du projet, accéder au dossier frontend :

```bash
cd frontend
```

Installer les dépendances :

```bash
npm install
```

Lancer le frontend :

```bash
ng serve
```

Ouvrir l’application :

```bash
http://localhost:4200/
```

## 🗄️ Base de données

Le projet utilise PostgreSQL avec Prisma.

### Patient

Un patient peut avoir plusieurs factures.

Champs principaux :

- prénom
- nom
- date de création
- date de modification

### Facture

Une facture est liée à un patient.

Champs principaux :

- montant
- mode de paiement
- type de prise en charge
- date de facturation
- note
- patient associé

## 🔗 Routes API principales

### Patients

| Méthode | Route | Description |
|---|---|---|
| GET | `/patients` | Récupérer tous les patients |
| POST | `/patients` | Ajouter un patient |
| GET | `/patients/:id` | Récupérer un patient |
| PATCH | `/patients/:id` | Modifier un patient |
| DELETE | `/patients/:id` | Supprimer un patient |

### Factures

| Méthode | Route | Description |
|---|---|---|
| GET | `/invoices` | Récupérer toutes les factures |
| POST | `/invoices` | Ajouter une facture |
| GET | `/invoices/:id` | Récupérer une facture |
| PATCH | `/invoices/:id` | Modifier une facture |
| DELETE | `/invoices/:id` | Supprimer une facture |

### Résumé journalier

| Méthode | Route | Description |
|---|---|---|
| GET | `/invoices/summary/daily` | Récupérer le résumé du jour |
| GET | `/invoices/summary/daily?date=YYYY-MM-DD` | Récupérer le résumé d’une date précise |

## 🧾 Exemple de création de patient

```json
{
  "firstName": "Sarah",
  "lastName": "Martin"
}
```

## 🧾 Exemple de création de facture

```json
{
  "patientId": "id-du-patient",
  "amount": 25,
  "coverageType": "STANDARD",
  "paymentMethod": "CARD",
  "billingDate": "2026-05-17",
  "notes": "Consultation réglée par carte"
}
```

## 🏗️ Build

Créer une version de production du frontend :

```bash
cd frontend
ng build
```

Créer une version de production du backend :

```bash
cd backend
npm run build
```

## 🎯 Objectif du projet

Ce projet a été développé pour pratiquer la création d’une application fullstack complète autour d’un cas métier concret.

Il m’a permis de travailler sur :

- la création d’une API REST avec NestJS ;
- la modélisation de données avec Prisma ;
- la connexion à une base PostgreSQL ;
- la consommation d’une API avec Angular ;
- la gestion d’état avec Angular Signals ;
- la création de formulaires Angular ;
- la relation entre patients et factures ;
- la création d’un tableau de bord métier ;
- le déploiement d’une application fullstack.

## 🚧 Améliorations possibles

- Ajouter une authentification
- Ajouter la modification des patients
- Ajouter la modification des factures
- Ajouter une recherche patient
- Ajouter des filtres par date
- Ajouter une pagination
- Exporter les factures en PDF
- Exporter le résumé journalier en Excel
- Ajouter des statistiques mensuelles

## 👩‍💻 Auteur

Projet développé par GHERRI Yesmine.

GitHub :  
https://github.com/ygherri