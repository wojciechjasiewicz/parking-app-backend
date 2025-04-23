import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';
import { Office } from './office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Office])],
  providers: [OfficesService],
  controllers: [OfficesController],
})
export class OfficesModule {}
