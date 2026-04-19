import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto, UpdateClientDto } from './clients.dto';
import { PrismaService } from 'prisma.service';

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) {}

  findAll(userId: number) {
    return this.prisma.client.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number, userId: number) {
    const c = await this.prisma.client.findFirst({
      where: { id, userId },
      include: {
        invoices: {
          orderBy: { issueDate: 'desc' },
          take: 10,
        },
      },
    });
    if (!c) throw new NotFoundException('Cliente no encontrado');
    return c;
  }

  create(dto: CreateClientDto, userId: number) {
    return this.prisma.client.create({ data: { ...dto, userId } });
  }

  async update(id: number, dto: UpdateClientDto, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.client.update({ where: { id }, data: dto });
  }

  async remove(id: number, userId: number) {
    await this.findOne(id, userId);
    return this.prisma.client.delete({ where: { id } });
  }
}
