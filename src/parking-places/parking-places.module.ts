import { Module } from '@nestjs/common';
import { ParkingPlacesService } from './parking-places.service';
import { ParkingPlacesController } from './parking-places.controller';
import { DatabaseModule } from '../database/database.module';
import { parkingPlaceProviders } from './parking-place-providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ParkingPlacesController],
  providers: [...parkingPlaceProviders, ParkingPlacesService],
})
export class ParkingPlacesModule {}
