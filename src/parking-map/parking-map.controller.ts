import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';

import { ParkingMapService } from './parking-map.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetPakingMapListDto } from './get-parking-map-list.dto';
import { ParkingPlacesService } from './parking-place.service';

@Controller('parking-maps')
export class ParkingMapsController {
  constructor(
    private readonly parkingMapService: ParkingMapService,
    private readonly parkingPlaceService: ParkingPlacesService,
  ) {}

  @Get()
  async getList(
    @Query('groupName')
    groupName: string,
  ): Promise<GetPakingMapListDto> {
    return await this.parkingMapService.getMapList(groupName);
  }

  @Get('/:id')
  async getOne(@Param('id') id: number) {
    return await this.parkingMapService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async addMap(
    @UploadedFile() image: Express.Multer.File,
    @Body('groupName') groupName: string,
    @Body('mapName') mapName: string,
  ) {
    await this.parkingMapService.create(image, groupName, mapName);
  }

  @Patch(':id')
  async addParkingPlace(
    @Param('id') id: number,
    @Body() parkingPlace: CreateParkingPlaceDto,
  ) {
    return await this.parkingPlaceService.create(id, parkingPlace);
  }
}
