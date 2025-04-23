import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Reservation } from '../reservations/reservation.entity';
import { ParkingMap } from '../parking-maps/parking-maps.entity';

@Entity()
export class ParkingPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 5 })
  label: string;

  @Column()
  positionX: number;

  @Column()
  positionY: number;

  @OneToMany(() => Reservation, (reservation) => reservation.parkingPlace)
  reservations: Reservation[];

  @ManyToOne(() => ParkingMap, (parkingMap) => parkingMap.parkingPlaces)
  parkingMap: ParkingMap;
}
