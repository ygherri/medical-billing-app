import {
  BadRequestException, Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async getDailySummary(date?: string) {
    const selectedDate = date ?? new Date().toISOString().slice(0, 10);
    const [year, month, day] = selectedDate.split('-').map(Number);

    const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    const endDate = new Date(Date.UTC(year, month - 1, day + 1, 0, 0, 0));

    const invoices = await this.prisma.invoice.findMany({
      where: {
        billingDate: {
          gte: startDate,
          lt: endDate,
        },
      },
      include: {
        patient: true,
      },
      orderBy: {
        billingDate: 'desc',
      },
    });

    const totalAmount = invoices.reduce((total, invoice) => {
      return total + Number(invoice.amount);
    }, 0);

    const paymentMethods = invoices.reduce<Record<string, number>>(
      (summary, invoice) => {
        const method = invoice.paymentMethod;
        summary[method] = (summary[method] ?? 0) + Number(invoice.amount);
        return summary;
      },
      {},
    );

    const coverageTypes = invoices.reduce<Record<string, number>>(
      (summary, invoice) => {
        const type = invoice.coverageType;
        summary[type] = (summary[type] ?? 0) + 1;
        return summary;
      },
      {},
    );

    return {
      date: selectedDate,
      invoiceCount: invoices.length,
      totalAmount: Number(totalAmount.toFixed(2)),
      paymentMethods,
      coverageTypes,
      invoices,
    };
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: {
        patient: true,
      },
      orderBy: {
        billingDate: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const invoice = await this.prisma.invoice.findUnique({
      where: { id },
      include: {
        patient: true,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Invoice not found');
    }

    return invoice;
  }

  async create(createInvoiceDto: CreateInvoiceDto) {
    const patient = await this.prisma.patient.findUnique({
      where: {
        id: createInvoiceDto.patientId,
      },
    });

    if (!patient) {
      throw new NotFoundException('Patient not found');
    }

    if (
  createInvoiceDto.coverageType === 'STANDARD' &&
  !createInvoiceDto.paymentMethod
) {
  throw new BadRequestException(
    'Payment method is required for standard coverage',
  );
}

return this.prisma.invoice.create({
  data: {
    amount: createInvoiceDto.amount,
    paymentMethod:
      createInvoiceDto.coverageType === 'STANDARD'
        ? createInvoiceDto.paymentMethod
        : null,
    coverageType: createInvoiceDto.coverageType,
    billingDate: new Date(createInvoiceDto.billingDate),
    notes: createInvoiceDto.notes,
    patient: {
      connect: {
        id: createInvoiceDto.patientId,
      },
    },
  },
  include: {
    patient: true,
  },
});

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto) {
    await this.findOne(id);

    const data: Prisma.InvoiceUpdateInput = {};

    if (updateInvoiceDto.amount !== undefined) {
      data.amount = updateInvoiceDto.amount;
    }

    if (updateInvoiceDto.paymentMethod !== undefined) {
      data.paymentMethod = updateInvoiceDto.paymentMethod;
    }

    if (updateInvoiceDto.coverageType !== undefined) {
      data.coverageType = updateInvoiceDto.coverageType;
    }

    if (updateInvoiceDto.billingDate !== undefined) {
      data.billingDate = new Date(updateInvoiceDto.billingDate);
    }

    if (updateInvoiceDto.notes !== undefined) {
      data.notes = updateInvoiceDto.notes;
    }

    if (updateInvoiceDto.patientId !== undefined) {
      const patient = await this.prisma.patient.findUnique({
        where: {
          id: updateInvoiceDto.patientId,
        },
      });

      if (!patient) {
        throw new NotFoundException('Patient not found');
      }

      data.patient = {
        connect: {
          id: updateInvoiceDto.patientId,
        },
      };
    }

    return this.prisma.invoice.update({
      where: { id },
      data,
      include: {
        patient: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.invoice.delete({
      where: { id },
    });
  }
}
