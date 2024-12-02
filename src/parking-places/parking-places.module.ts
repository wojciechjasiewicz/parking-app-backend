import { Module } from '@nestjs/common';
import { ParkingPlacesService } from './parking-places.service';

@Module({
  imports: [ParkingPlacesService],
})
export class ParkingPlacesModule {}
