import { Injectable, NotFoundException } from '@nestjs/common';
import { ParkingPlace } from './parking-place.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParkingPlaceDto } from './create-parking-place.dto';
import { ParkingMap } from 'src/parking-maps/parking-maps.entity';

@Injectable()
export class ParkingPlacesService {
  constructor(
    @InjectRepository(ParkingPlace)
    private readonly parkingPlaceRepository: Repository<ParkingPlace>,
    @InjectRepository(ParkingMap)
    private readonly parkingMapRepository: Repository<ParkingMap>,
  ) {}

  async findAll(mapId?: number): Promise<ParkingPlace[]> {
    const parkingPlaces = await this.parkingPlaceRepository.find({
      where: { parkingMap: { id: mapId } },
    });
    return parkingPlaces;
  }

  async createOne({
    label,
    positionX,
    positionY,
    mapId,
  }: CreateParkingPlaceDto) {
    const parkingMap = await this.parkingMapRepository.findOne({
      where: { id: mapId },
    });

    if (!parkingMap) {
      throw new NotFoundException(`Parking map ${mapId} doesn't exist`);
    }

    const { identifiers } = await this.parkingPlaceRepository
      .createQueryBuilder()
      .insert()
      .into(ParkingPlace)
      .values({
        label,
        positionX: Math.round(positionX),
        positionY: Math.round(positionY),
        parkingMap,
      })
      .onConflict(
        `("label") DO UPDATE SET position_x = EXCLUDED.position_x, position_y = EXCLUDED.position_y`,
      )
      .returning('id')
      .execute();

    return identifiers[0]['id'] as number;
  }

  async deleteOne(id: number) {
    console.log(`Delete parking place: ${id}`);
    const place = await this.parkingPlaceRepository.findOne({
      where: { id },
    });
    if (!place) {
      throw new Error(`Parking place ${id} not found`);
    }
    await this.parkingPlaceRepository.delete(id);
    return id;
  }
}
