import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ParkingMap } from '../parking-maps/parking-maps.entity';

@Entity()
export class Office {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => ParkingMap, (parkingMap) => parkingMap.office)
  parkingMaps: ParkingMap[];
}
