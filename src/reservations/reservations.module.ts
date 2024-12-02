import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from 'src/database/database.module';
import { reservationProviders } from './reservation-providers';
import { parkingPlaceProviders } from '../parking-places/parking-place-providers';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...reservationProviders,
    ...parkingPlaceProviders,
    ReservationsService,
  ],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
