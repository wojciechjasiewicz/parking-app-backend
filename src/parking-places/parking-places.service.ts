import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ParkingPlace } from './parking-place.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateParkingPlaceDto } from './create-parking-place.dto';
import { ParkingMap } from 'src/parking-maps/parking-maps.entity';
import { UpdateParkingPlaceDto } from './update-parking-place.dto';
import { GetParkingPlaceDto } from './get-parking-place.dto';

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

  async getOne(id: number): Promise<GetParkingPlaceDto> {
    const place = await this.parkingPlaceRepository.findOne({
      select: { id: true, label: true, positionX: true, positionY: true },
      where: { id },
    });

    if (!place) {
      throw new NotFoundException(`Parking place ${id} not found`);
    }

    return place;
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

    const parkingPlace = await this.parkingPlaceRepository.create({
      label,
      positionX,
      positionY,
      parkingMap,
    });

    const result = await this.parkingPlaceRepository.save(parkingPlace);
    return result.id;
  }

  async update(
    id: number,
    { label, positionX, positionY }: UpdateParkingPlaceDto,
  ): Promise<Required<UpdateParkingPlaceDto>> {
    const place = await this.parkingPlaceRepository.findOne({
      where: { id },
    });

    if (!place) {
      throw new BadRequestException(`Parking place ${id} not found`);
    }

    return await this.parkingPlaceRepository.save({
      ...place,
      label,
      positionX,
      positionY,
    });
  }

  async deleteOne(id: number) {
    console.log(`Delete parking place: ${id}`);
    const place = await this.parkingPlaceRepository.findOne({
      where: { id },
    });

    if (!place) {
      throw new NotFoundException(`Parking place ${id} not found`);
    }

    await this.parkingPlaceRepository.delete(id);
    return id;
  }
}
