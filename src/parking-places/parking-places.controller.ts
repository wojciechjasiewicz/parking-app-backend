import { Controller, Get } from '@nestjs/common';

@Controller('parking-places')
export class ParkingPlacesController {
  @Get()
  async getAll() {}
}
