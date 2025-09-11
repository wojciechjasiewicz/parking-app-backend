import { Injectable } from '@nestjs/common'
import { Reservation } from './reservation.entity'
import { ParkingPlace } from '../parking-map/entity/parking-place.entity'
import type { Repository } from 'typeorm'
import type { CreateReservationDto } from './create-reservation.dto'
import { DateTime } from 'luxon'
import { User } from 'src/user/user.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(ParkingPlace)
    private readonly parkingPlaceRepository: Repository<ParkingPlace>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(parkingPlaceId: number) {
    const reservations =
      (await this.reservationRepository.find({
        select: {
          id: true,
          date: true,
          parkingPlaceId: true,
          userId: true,
        },
        where: {
          parkingPlaceId: parkingPlaceId,
        },
      })) || []

    console.log(`Reservations for place: ${parkingPlaceId}`, reservations)

    return reservations
  }

  async deleteOne(id: number) {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
    })
    if (!reservation) {
      throw new Error(`Reservation ${id} not found`)
    }
    await this.reservationRepository.delete(id)
    return id
  }

  async createOne(reservation: CreateReservationDto) {
    const parkingPlace = await this.parkingPlaceRepository.findOne({
      where: { id: reservation.parkingPlaceId },
    })

    if (!parkingPlace) {
      throw new Error(
        `Parking place id: ${reservation.parkingPlaceId} doesn't exist`,
      )
    }

    const user = await this.userRepository.findOne({
      where: { id: reservation.userId },
    })

    if (!user) {
      throw new Error(`User id: ${reservation.userId} doesn't exist`)
    }

    const newReservationDate = DateTime.fromJSDate(reservation.date).plus({
      hour: 3,
    })
    const now = DateTime.now().startOf('day')
    if (newReservationDate < now) {
      throw new Error(
        `It is not possible to make a reservation to the past day: ${reservation.date}`,
      )
    }

    const existedReservation = await this.reservationRepository.findOne({
      where: {
        parkingPlaceId: reservation.parkingPlaceId,
        userId: reservation.userId,
        date: reservation.date,
      },
    })

    if (existedReservation) {
      throw new Error(
        `The date: ${reservation.date} for parking place: ${reservation.parkingPlaceId} already reserved`,
      )
    }

    let numberOfPossibleDays = 0
    if (now.weekday >= 4) {
      numberOfPossibleDays = 11 - (now.weekday - 4)
    } else {
      numberOfPossibleDays = 11 - (now.weekday + 4)
    }

    if (
      now.plus({ days: numberOfPossibleDays }).startOf('day') >
      newReservationDate
    ) {
      throw new Error(
        `Today it is possible to make a reservation only ${numberOfPossibleDays} in advance.`,
      )
    }

    const newReservation = await this.reservationRepository.create({
      date: reservation.date,
      parkingPlaceId: reservation.parkingPlaceId,
      userId: reservation.userId,
    })

    const result = await this.reservationRepository.save(newReservation)

    return result.id
  }
}
