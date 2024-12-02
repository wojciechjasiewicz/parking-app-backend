import { Module } from '@nestjs/common';
import { ParkingMapsController } from './parking-maps.controller';
import { ParkingMapsService } from './parking-maps.service';
import { parkingMapProviders } from './parking-maps-providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ParkingMapsController],
  providers: [...parkingMapProviders, ParkingMapsService],
})
export class ParkingMapsModule {}
