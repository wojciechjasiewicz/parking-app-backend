import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ParkingMap } from './parking-map.entity';

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

  @ManyToOne(() => ParkingMap, (parkingMap) => parkingMap.parkingPlaces)
  parkingMap: ParkingMap;
}
