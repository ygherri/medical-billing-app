import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

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

    return this.prisma.invoice.create({
      data: {
        amount: createInvoiceDto.amount,
        paymentMethod: createInvoiceDto.paymentMethod,
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
  }

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
