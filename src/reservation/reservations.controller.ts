import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common'
import type { ReservationsService } from './reservations.service'
import type { Reservation } from './reservation.entity'
import type { CreateReservationDto } from './create-reservation.dto'

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  async getReservationList(
    @Query('placeId', ParseIntPipe) parkingPlaceId: number,
  ): Promise<Reservation[]> {
    return await this.reservationsService.findAll(parkingPlaceId)
  }

  @Post()
  async createReservation(
    @Body() reservation: CreateReservationDto,
  ): Promise<number> {
    return await this.reservationsService.createOne(reservation)
  }

  @Delete(':id')
  async deleteReservation(
    @Param('id', ParseIntPipe) reservationId: number,
  ): Promise<string> {
    const id = await this.reservationsService.deleteOne(reservationId)
    return `${id}`
  }
}
