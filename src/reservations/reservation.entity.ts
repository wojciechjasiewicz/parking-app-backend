import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParkingPlace } from '../parking-places/parking-place.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ParkingPlace, (parkingPlace) => parkingPlace.reservations)
  @JoinColumn({ name: 'parking_place_id' })
  parkingPlace: ParkingPlace;

  @Column()
  date: Date;
}
