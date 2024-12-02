import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ParkingPlacesModule } from './parking-places/parking-places.module';
import { ReservationsModule } from './reservations/reservations.module';

@Module({
  imports: [ParkingPlacesModule, ReservationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
