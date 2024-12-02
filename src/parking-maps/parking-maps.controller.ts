import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ParkingMapsService } from './parking-maps.service';
import { ParkingMap } from './parking-maps.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('parking-maps')
export class ParkingMapsController {
  constructor(private readonly parkingMapsService: ParkingMapsService) {}

  @Get()
  async getMapList(): Promise<{ id: number; name: string }[]> {
    return await this.parkingMapsService.getMapList();
  }

  @Get('/:id')
  async getMap(@Param('id') id: number) {
    return await this.parkingMapsService.findOne(id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async addMap(@UploadedFile() image: Express.Multer.File) {
    await this.parkingMapsService.create(image);
  }

  @Patch()
  async addParkingPlace() {}
}
