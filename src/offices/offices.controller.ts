import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { OfficesService } from './offices.service';
import { GetOfficeListDto } from './get-office-list.dto';
import { GetOfficeDto } from './get-office.dto';
import { CreateOfficeDto } from './create-office.dto';

@Controller('offices')
export class OfficesController {
  constructor(private readonly officesService: OfficesService) {}

  @Get()
  async findAll(): Promise<GetOfficeListDto> {
    return await this.officesService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetOfficeDto> {
    return await this.officesService.findById(id);
  }

  @Post()
  async create(@Body() office: CreateOfficeDto): Promise<number> {
    return await this.officesService.create(office);
  }
}
