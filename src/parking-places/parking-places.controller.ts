import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { ParkingPlacesService } from './parking-places.service';
import { ParkingPlace } from './parking-place.entity';
import { CreateParkingPlaceDto } from './create-parking-place.dto';
import { UpdateParkingPlaceDto } from './update-parking-place.dto';
import { GetParkingPlaceDto } from './get-parking-place.dto';

@Controller('parking-places')
export class ParkingPlacesController {
  constructor(private readonly parkingPlaceService: ParkingPlacesService) {}

  @Get()
  async findAll(
    @Query('mapId', ParseIntPipe) mapId: number,
  ): Promise<ParkingPlace[]> {
    return await this.parkingPlaceService.findAll(mapId);
  }

  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) placeId: number,
  ): Promise<GetParkingPlaceDto> {
    return await this.parkingPlaceService.getOne(placeId);
  }

  @Post()
  async create(@Body() parkingPlace: CreateParkingPlaceDto): Promise<number> {
    return await this.parkingPlaceService.createOne(parkingPlace);
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() parkingPlace: UpdateParkingPlaceDto,
  ): Promise<Required<UpdateParkingPlaceDto>> {
    return await this.parkingPlaceService.update(id, parkingPlace);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) placeId: number): Promise<string> {
    const id = await this.parkingPlaceService.deleteOne(placeId);
    return `${id}`;
  }
}
