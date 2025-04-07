import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ParkingPlace } from '../parking-places/parking-place.entity';
import { User } from 'src/users/user.entity';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ParkingPlace, (parkingPlace) => parkingPlace.reservations)
  @JoinColumn({ name: 'parking_place_id' })
  parkingPlace: ParkingPlace;

  @ManyToOne(() => User, (user) => user.reservations)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  date: Date;
}
