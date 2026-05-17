import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getApiInfo() {
    return {
      name: 'Medi-Billing API',
      description:
        'API REST pour la gestion des patients, des factures et du résumé journalier de facturation médicale.',
      version: '1.0.0',
      frontend: 'https://medical-billing-web.netlify.app',
      documentation: 'https://medical-billing-app-zxko.onrender.com/api-docs',
      endpoints: {
        patients: {
          getAll: 'GET /patients',
          getOne: 'GET /patients/:id',
          create: 'POST /patients',
          update: 'PATCH /patients/:id',
          delete: 'DELETE /patients/:id',
        },
        invoices: {
          getAll: 'GET /invoices',
          getOne: 'GET /invoices/:id',
          create: 'POST /invoices',
          update: 'PATCH /invoices/:id',
          delete: 'DELETE /invoices/:id',
          dailySummary: 'GET /invoices/summary/daily?date=YYYY-MM-DD',
        },
      },
    };
  }
}
