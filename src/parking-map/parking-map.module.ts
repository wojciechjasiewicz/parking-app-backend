import { Module } from '@nestjs/common'
import { ParkingMapsController } from './parking-map.controller'
import { ParkingMapService } from './parking-map.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ParkingMap } from './entity/parking-map.entity'

@Module({
  imports: [TypeOrmModule.forFeature([ParkingMap])],
  controllers: [ParkingMapsController],
  providers: [ParkingMapService],
})
export class ParkingMapModule {}
