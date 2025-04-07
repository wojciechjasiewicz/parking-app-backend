import { Injectable, Inject } from '@nestjs/common';
import { Office } from './office.entity';
import { Repository } from 'typeorm';
import { GetOfficeListDto } from './get-office-list.dto';
import { GetOfficeDto } from './get-office.dto';

@Injectable()
export class OfficesService {
  constructor(
    @Inject('OFFICE_REPOSITORY')
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
      select: { id: true, name: true, parkingMaps: { id: true, name: true } },
      where: { id },
      relations: {
        parkingMaps: true,
      },
    });

    return {
      id: office.id,
      name: office.name,
      maps: office.parkingMaps.map(({ id, name }) => ({ id, name })),
    };
  }
}
