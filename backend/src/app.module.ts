import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PatientsModule } from './patients/patients.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [PrismaModule, PatientsModule, InvoicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
