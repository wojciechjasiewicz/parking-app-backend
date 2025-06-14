import { Module } from '@nestjs/common';
import { ParkingPlacesService } from './parking-places.service';
import { ParkingPlacesController } from './parking-places.controller';
import { ParkingPlace } from './parking-place.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingMap } from '../parking-maps/parking-maps.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingPlace, ParkingMap])],
  controllers: [ParkingPlacesController],
  providers: [ParkingPlacesService],
})
export class ParkingPlacesModule {}
