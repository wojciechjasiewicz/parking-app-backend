import { Injectable, Inject } from '@nestjs/common';
import { ParkingPlace } from './parking-place.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParkingPlacesService {
  constructor(
    @Inject('PARKING_PLACE_REPOSITORY')
    private readonly parkingPlaceRepositiry: Repository<ParkingPlace>,
  ) {}

  async findAll(mapId?: number): Promise<ParkingPlace[]> {
    const a = await this.parkingPlaceRepositiry.find({
      where: { parkingMap: { id: mapId } },
    });
    return a;
  }
}
