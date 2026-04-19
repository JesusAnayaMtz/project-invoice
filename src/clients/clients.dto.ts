import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateClientDto {
  @IsString()
  name!: string;

  @IsOptional() @IsString()
  contact?: string;

  @IsOptional() @IsString()
  address?: string;

  @IsOptional() @IsString()
  phone?: string;

  @IsOptional() @IsEmail()
  email?: string;

  @IsOptional() @IsString()
  ein?: string;

  @IsOptional() @IsString()
  notes?: string;
}

export class UpdateClientDto extends CreateClientDto {}