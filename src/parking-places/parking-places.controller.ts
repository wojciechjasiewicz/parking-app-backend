import { Controller, Get, Query } from '@nestjs/common';
import { ParkingPlacesService } from './parking-places.service';
import { ParkingPlace } from './parking-place.entity';

@Controller('parking-places')
export class ParkingPlacesController {
  constructor(private readonly parkingPlaceService: ParkingPlacesService) {}

  @Get()
  async findAll(@Query('mapId') mapId: number): Promise<ParkingPlace[]> {
    return await this.parkingPlaceService.findAll(mapId);
  }
}
