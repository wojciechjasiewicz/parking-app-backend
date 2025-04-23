import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ParkingMapsService } from './parking-maps.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetPakingMapListDto } from './get-parking-map-list.dto';

@Controller('parking-maps')
export class ParkingMapsController {
  constructor(private readonly parkingMapsService: ParkingMapsService) {}

  @Get()
  async getMapList(
    @Query('officeId', ParseIntPipe) officeId: number,
  ): Promise<GetPakingMapListDto> {
    return await this.parkingMapsService.getMapList(officeId);
  }

  @Get('/:id')
  async getMap(@Param('id') id: number) {
    return await this.parkingMapsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async addMap(
    @UploadedFile() image: Express.Multer.File,
    @Body('officeId') officeId: number,
    @Body('mapName') mapName: string,
  ) {
    console.log(`${officeId} ${mapName}`);
    await this.parkingMapsService.create(image, officeId, mapName);
  }

  @Patch()
  async addParkingPlace() {}
}
