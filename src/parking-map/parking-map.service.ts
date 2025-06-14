import { Injectable, NotFoundException } from '@nestjs/common';
import { ParkingMap } from './parking-map.entity';
import { Repository } from 'typeorm';
import { GetPakingMapListDto } from './get-parking-map-list.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParkingMapService {
  constructor(
    @InjectRepository(ParkingMap)
    private readonly parkingMapsRepository: Repository<ParkingMap>,
  ) {}

  async findOne(id: number) {
    const parkingMap = await this.parkingMapsRepository.findOne({
      select: { id: true, name: true, data: true, parkingPlaces: true },
      relations: { parkingPlaces: true },
      where: { id },
    });

    if (!parkingMap) {
      throw new NotFoundException(`Missing parking map: ${id}`);
    }

    return { ...parkingMap, data: parkingMap.data.toString('base64') };
  }

  async create(
    imageMap: Express.Multer.File,
    groupName: string,
    mapName: string,
  ): Promise<number> {
    const parkingMap = await this.parkingMapsRepository.findOne({
      where: { name: mapName, groupName },
    });

    if (parkingMap) {
      throw new Error(
        `Parking map ${mapName} in group ${groupName} already exists`,
      );
    }

    const newParkingMap = await this.parkingMapsRepository.create({
      name: mapName,
      fileType: imageMap.mimetype,
      data: imageMap.buffer,
      groupName,
    });

    const { id } = await this.parkingMapsRepository.save(newParkingMap);
    return id;
  }

  async getMapList(groupName: string): Promise<GetPakingMapListDto> {
    const parkingMaps = await this.parkingMapsRepository.find({
      select: { id: true, name: true },
      where: { groupName },
    });

    return {
      parkingMaps: parkingMaps.map(({ id, name }) => ({ id, name })),
    };
  }
}
