import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule } from 'src/database/database.module';
import { reservationProviders } from './reservation-providers';
import { parkingPlaceProviders } from '../parking-places/parking-place-providers';
import { userProviders } from 'src/users/user-provider';

@Module({
  imports: [DatabaseModule],
  providers: [
    ...reservationProviders,
    ...parkingPlaceProviders,
    ...userProviders,
    ReservationsService,
  ],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
