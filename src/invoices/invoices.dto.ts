import {
  IsString, IsOptional, IsNumber,
  IsEnum, IsArray, ValidateNested, IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceItemDto {
  @IsString() 
  description!: string;
  @IsNumber() 
  quantity!: number;
  @IsNumber() 
  rate!: number;
  @IsNumber() 
  amount!: number;
}

export class CreateInvoiceDto {
  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional() @IsEnum(['DUE', 'PAID', 'OVERDUE']) 
  status?: string;

  @IsDateString() 
  issueDate!: string;

  @IsOptional() 
  @IsDateString() 
  dueDate?: string;

  @IsOptional() 
  @IsString() 
  currency?: string;

  @IsNumber() 
  clientId!: number;

  @IsNumber() 
  subtotal!: number;

  @IsOptional() 
  @IsNumber() 
  discountPct?: number;

  @IsOptional() 
  @IsNumber() 
  discountAmt?: number;

  @IsOptional() 
  @IsNumber() 
  taxPct?: number;

  @IsOptional() 
  @IsNumber() 
  taxAmt?: number;

  @IsNumber() 
  total!: number;

  @IsOptional() 
  @IsString() 
  paymentInfo?: string;

  @IsOptional() 
  @IsString() 
  paymentTerms?: string;

  @IsOptional() 
  @IsString() 
  notes?: string;

  @IsArray() 
  @ValidateNested({ each: true }) 
  @Type(() => InvoiceItemDto)
  items!: InvoiceItemDto[];
}

export class UpdateInvoiceDto extends CreateInvoiceDto {}