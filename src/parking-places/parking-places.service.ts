import { Injectable } from '@nestjs/common';
import { ParkingPlace } from './parking-place.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParkingPlacesService {
  constructor(
    @InjectRepository(ParkingPlace)
    private readonly parkingPlaceRepositiry: Repository<ParkingPlace>,
  ) {}

  async findAll(mapId?: number): Promise<ParkingPlace[]> {
    const a = await this.parkingPlaceRepositiry.find({
      where: { parkingMap: { id: mapId } },
    });
    return a;
  }
}
