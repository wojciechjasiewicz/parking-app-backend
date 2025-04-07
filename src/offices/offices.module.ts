import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { officeProviders } from './office-provider';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';

@Module({
  imports: [DatabaseModule],
  providers: [...officeProviders, OfficesService],
  controllers: [OfficesController],
})
export class OfficesModule {}
