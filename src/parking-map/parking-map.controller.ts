import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'

import type { ParkingMapService } from './parking-map.service'
import { FileInterceptor } from '@nestjs/platform-express'
import type { GetParkingMapListDto } from './dto/get-parking-map-list.dto'

@Controller('parking-maps')
export class ParkingMapsController {
  constructor(private readonly parkingMapService: ParkingMapService) {}

  @Get()
  async getMapList(
    @Query('groupName')
    groupName?: string,
  ): Promise<GetParkingMapListDto> {
    return await this.parkingMapService.getMapList(groupName)
  }

  @Get('/:id')
  async getMap(@Param('id') id: number) {
    return await this.parkingMapService.findOne(id)
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async addMap(
    @UploadedFile() image: Express.Multer.File,
    @Body('groupName') groupName: string,
    @Body('mapName') mapName: string,
  ) {
    await this.parkingMapService.create(image, groupName, mapName)
  }

  @Patch('/:id')
  async updateMap() {}

  @Delete('/:id')
  async deleteMap() {}

  @Patch('/:id')
  async addParkingPlace() {}

  @Delete('/:id/parking-place/:placeId')
  async deleteParkingPlace() {}
}
