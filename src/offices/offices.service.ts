import { Injectable } from '@nestjs/common';
import { Office } from './office.entity';
import { Repository } from 'typeorm';
import { GetOfficeListDto } from './get-office-list.dto';
import { GetOfficeDto } from './get-office.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OfficesService {
  constructor(
    @InjectRepository(Office)
    private readonly officeRepositiry: Repository<Office>,
  ) {}

  async findAll(): Promise<GetOfficeListDto> {
    const offices = await this.officeRepositiry.find({
      select: { id: true, name: true },
    });

    return { offices: offices.map(({ id, name }) => ({ id, name })) };
  }

  async findById(id: number): Promise<GetOfficeDto> {
    const office = await this.officeRepositiry.findOne({
      select: {
        id: true,
        name: true,
        parkingMaps: {
          id: true,
          name: true,
          data: true,
        },
      },
      where: { id },
      relations: {
        parkingMaps: { parkingPlaces: true },
      },
    });

    return {
      id: office.id,
      name: office.name,
      maps: office.parkingMaps.map(({ id, name }) => ({ id, name })),
    };
  }
}
