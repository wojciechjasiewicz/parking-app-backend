import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ParkingPlacesService } from './parking-places.service';
import { ParkingPlace } from './parking-place.entity';
import { CreateParkingPlaceDto } from './create-parking-place.dto';

@Controller('parking-places')
export class ParkingPlacesController {
  constructor(private readonly parkingPlaceService: ParkingPlacesService) {}

  @Get()
  async findAll(@Query('mapId') mapId: number): Promise<ParkingPlace[]> {
    return await this.parkingPlaceService.findAll(mapId);
  }

  @Post()
  async create(@Body() parkingPlace: CreateParkingPlaceDto): Promise<number> {
    return await this.parkingPlaceService.createOne(parkingPlace);
  }

  @Delete(':id')
  async deleteOne(@Param('id') placeId: number): Promise<string> {
    const id = await this.parkingPlaceService.deleteOne(placeId);
    return `${id}`;
  }
}
