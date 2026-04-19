import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClientsModule } from './clients/clients.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [AuthModule, ClientsModule, InvoicesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
