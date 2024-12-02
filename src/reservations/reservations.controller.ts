import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { Reservation } from './reservation.entity';
import { CreateReservationDto } from './create-reservation.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async findAll(
    @Query('placeLabel') parkingPlaceLabel: string,
  ): Promise<Reservation[]> {
    return await this.reservationsService.findAll(parkingPlaceLabel);
  }

  @Delete(':id')
  async deleteOne(@Param('id') reservationId: number): Promise<string> {
    const id = await this.reservationsService.deleteOne(reservationId);
    return `${id}`;
  }

  @Post()
  async createOne(@Body() reservation: CreateReservationDto): Promise<number> {
    return await this.reservationsService.createOne(reservation);
  }
}
