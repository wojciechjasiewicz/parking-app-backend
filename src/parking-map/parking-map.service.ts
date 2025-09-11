import { Injectable, NotFoundException } from '@nestjs/common'

import { ParkingMap } from './entity/parking-map.entity'
import type { Repository } from 'typeorm'
import type { GetParkingMapListDto } from './dto/get-parking-map-list.dto'
import { InjectRepository } from '@nestjs/typeorm'
import type { GetParkingMapDto } from './dto/get-parking-map.dto'

@Injectable()
export class ParkingMapService {
  constructor(
    @InjectRepository(ParkingMap)
    private readonly parkingMapsRepository: Repository<ParkingMap>,
  ) {}

  async getMapList(groupName?: string): Promise<GetParkingMapListDto> {
    const parkingMaps = await this.parkingMapsRepository.find({
      select: { id: true, name: true, groupName: true },
      where: { groupName },
    })

    return {
      parkingMaps: parkingMaps.map(({ id, name, groupName }) => ({
        id,
        name,
        groupName,
      })),
    }
  }

  async findOne(id: number): Promise<GetParkingMapDto> {
    const parkingMap = await this.parkingMapsRepository.findOne({
      select: {
        id: true,
        name: true,
        groupName: true,
        data: true,
        parkingPlaces: true,
      },
      relations: { parkingPlaces: true },
      where: { id },
    })

    if (!parkingMap) {
      throw new NotFoundException(`Missing parking map: ${id}`)
    }

    return { ...parkingMap, data: parkingMap.data.toString('base64') }
  }

  async create(
    imageMap: Express.Multer.File,
    groupName: string,
    mapName: string,
  ): Promise<number> {
    const parkingMap = await this.parkingMapsRepository.findOne({
      where: { name: mapName, groupName },
    })

    if (parkingMap) {
      throw new Error(
        `Parking map ${mapName} in group ${groupName} already exists`,
      )
    }

    const newParkingMap = await this.parkingMapsRepository.create({
      name: mapName,
      fileType: imageMap.mimetype,
      data: imageMap.buffer,
      groupName,
    })

    const { id } = await this.parkingMapsRepository.save(newParkingMap)
    return id
  }

  async delete(id: number): Promise<void> {
    const parkingMap = await this.parkingMapsRepository.findOne({
      where: { id },
    })

    if (!parkingMap) {
      throw new NotFoundException(`Missing parking map: ${id}`)
    }

    await this.parkingMapsRepository.delete(id)
  }
}
