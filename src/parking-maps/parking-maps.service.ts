import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { ParkingMap } from './parking-maps.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParkingMapsService {
  constructor(
    @Inject('PARKING_MAP_REPOSITORY')
    private readonly parkingMapsRepository: Repository<ParkingMap>,
  ) {}

  async findOne(id: number) {
    const parkingMap = await this.parkingMapsRepository.findOne({
      select: { id: true, name: true, data: true, parkingPlaces: true },
      relations: { parkingPlaces: true },
      where: { id },
    });

    console.log(parkingMap);

    if (!parkingMap) {
      throw new NotFoundException(`Missing parking map: ${id}`);
    }

    return { ...parkingMap, data: parkingMap.data.toString('base64') };
  }

  async create(imageMap: Express.Multer.File): Promise<number> {
    const newImage = this.parkingMapsRepository.create({
      name: imageMap.originalname,
      fileType: imageMap.mimetype,
      data: imageMap.buffer,
    });

    const { id } = await this.parkingMapsRepository.save(newImage);
    return id;
  }

  async getMapList(): Promise<{ id: number; name: string }[]> {
    const list = await this.parkingMapsRepository.find({
      select: { id: true, name: true },
    });

    return list.map(({ id, name }) => ({ id, name }));
  }
}
