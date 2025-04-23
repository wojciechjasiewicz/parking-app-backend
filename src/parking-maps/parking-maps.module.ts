import { Module } from '@nestjs/common';
import { ParkingMapsController } from './parking-maps.controller';
import { ParkingMapsService } from './parking-maps.service';
import { Office } from 'src/offices/office.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingMap } from './parking-maps.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Office, ParkingMap])],
  controllers: [ParkingMapsController],
  providers: [ParkingMapsService],
})
export class ParkingMapsModule {}
