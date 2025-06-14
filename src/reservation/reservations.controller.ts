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
  async getReservationList(
    @Query('placeId') parkingPlaceId: string,
  ): Promise<Reservation[]> {
    return await this.reservationsService.findAll(parkingPlaceId);
  }

  @Post()
  async createReservation(
    @Body() reservation: CreateReservationDto,
  ): Promise<number> {
    return await this.reservationsService.createOne(reservation);
  }

  @Delete(':id')
  async deleteReservation(@Param('id') reservationId: number): Promise<string> {
    const id = await this.reservationsService.deleteOne(reservationId);
    return `${id}`;
  }
}
