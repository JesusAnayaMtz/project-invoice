import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoices.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  private async assertClientOwnership(clientId: number, userId: number) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, userId },
      select: { id: true },
    });
    if (!client) throw new ForbiddenException('Cliente no pertenece al usuario');
  }

  async nextNumber(userId: number): Promise<string> {
    const last = await this.prisma.invoice.findFirst({
      where: { userId, number: { startsWith: 'FT-' } },
      orderBy: { id: 'desc' },
      select: { number: true },
    });
    const lastN = last ? parseInt(last.number.replace('FT-', ''), 10) : 0;
    const next = Number.isFinite(lastN) ? lastN + 1 : 1;
    return `FT-${String(next).padStart(3, '0')}`;
  }

  findAll(userId: number) {
    return this.prisma.invoice.findMany({
      where: { userId },
      include: { client: true, items: true },
      orderBy: { issueDate: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const inv = await this.prisma.invoice.findFirst({
      where: { id, userId },
      include: { client: true, items: true },
    });
    if (!inv) throw new NotFoundException('Factura no encontrada');
    return inv;
  }

  async create(dto: CreateInvoiceDto, userId: number) {
    await this.assertClientOwnership(dto.clientId, userId);
    const { items, number: _ignored, ...data } = dto;
    const number = await this.nextNumber(userId);
    return this.prisma.invoice.create({
      data: {
        ...data,
        number,
        status: (data.status as any) || 'DUE',
        issueDate: new Date(data.issueDate),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        userId,
        items: { create: items },
      },
      include: { client: true, items: true },
    });
  }

  async update(id: number, dto: UpdateInvoiceDto, userId: number) {
    await this.findOne(id, userId);
    await this.assertClientOwnership(dto.clientId, userId);
    const { items, ...data } = dto;
    await this.prisma.invoiceItem.deleteMany({ where: { invoiceId: id } });
    return this.prisma.invoice.update({
      where: { id },
      data: {
        ...data,
        status: (data.status as any) || 'DUE',
        issueDate: new Date(data.issueDate),
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        items: { create: items },
      },
      include: { client: true, items: true },
    });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.invoice.delete({ where: { id } });
  }

  async getStats(userId: number) {
    const invoices = await this.prisma.invoice.findMany({ where: { userId } });
    const total = invoices.reduce((a, i) => a + i.total, 0);
    const paid = invoices.filter(i => i.status === 'PAID').reduce((a, i) => a + i.total, 0);
    const due = invoices.filter(i => i.status === 'DUE').reduce((a, i) => a + i.total, 0);
    const overdue = invoices.filter(i => i.status === 'OVERDUE').reduce((a, i) => a + i.total, 0);
    return { total, paid, due, overdue, count: invoices.length };
  }
}