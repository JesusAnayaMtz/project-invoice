import {
  Controller, Get, Post, Put, Delete,
  Body, Param, ParseIntPipe, UseGuards, Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto, UpdateInvoiceDto } from './invoices.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('invoices')
export class InvoicesController {
  constructor(private invoices: InvoicesService) {}

  @Get('stats')
  stats(@Request() req) { return this.invoices.getStats(req.user.id); }

  @Get('next-number')
  async nextNumber(@Request() req) {
    return { number: await this.invoices.nextNumber(req.user.id) };
  }

  @Get()
  findAll(@Request() req) { return this.invoices.findAll(req.user.id); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.invoices.findOne(id, req.user.id);
  }

  @Post()
  create(@Body() dto: CreateInvoiceDto, @Request() req) {
    return this.invoices.create(dto, req.user.id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInvoiceDto, @Request() req) {
    return this.invoices.update(id, dto, req.user.id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.invoices.remove(id, req.user.id);
  }
}