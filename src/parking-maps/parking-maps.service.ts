import { Injectable, NotFoundException } from '@nestjs/common';
import { ParkingMap } from './parking-maps.entity';
import { Repository } from 'typeorm';
import { GetPakingMapListDto } from './get-parking-map-list.dto';
import { Office } from 'src/offices/office.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ParkingMapsService {
  constructor(
    @InjectRepository(ParkingMap)
    private readonly parkingMapsRepository: Repository<ParkingMap>,
    @InjectRepository(Office)
    private readonly officesRepository: Repository<Office>,
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

  async create(
    imageMap: Express.Multer.File,
    officeId: number,
    mapName: string,
  ): Promise<number> {
    const office = await this.officesRepository.findOne({
      where: { id: officeId },
    });

    if (!office) {
      throw new Error(`Office id: ${office.id} doesn't exist`);
    }

    const newParkingMap = await this.parkingMapsRepository.create({
      name: mapName,
      fileType: imageMap.mimetype,
      data: imageMap.buffer,
      office,
    });

    const { id } = await this.parkingMapsRepository.save(newParkingMap);
    return id;
  }

  async getMapList(officeId: number): Promise<GetPakingMapListDto> {
    const parkingMaps = await this.parkingMapsRepository.find({
      select: { id: true, name: true },
      where: { office: { id: officeId } },
    });

    return {
      parkingMaps: parkingMaps.map(({ id, name }) => ({ id, name })),
    };
  }
}
