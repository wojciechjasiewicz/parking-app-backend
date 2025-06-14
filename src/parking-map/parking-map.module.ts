import { Module } from '@nestjs/common';
import { ParkingMapsController } from './parking-map.controller';
import { ParkingMapsService } from './parking-map.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParkingMap } from './parking-map.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ParkingMap])],
  controllers: [ParkingMapsController],
  providers: [ParkingMapsService],
})
export class ParkingMapsModule {}
