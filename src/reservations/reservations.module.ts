import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { ParkingPlace } from 'src/parking-places/parking-place.entity';
import { Reservation } from './reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, ParkingPlace, Reservation])],
  providers: [ReservationsService],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
