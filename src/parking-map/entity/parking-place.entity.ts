import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { ParkingMap } from "./parking-map.entity";

@Entity()
export class ParkingPlace {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 5 })
  label: string;

  @Column({ type: "int" })
  positionX: number;

  @Column({ type: "int" })
  positionY: number;

  @ManyToOne(() => ParkingMap, (parkingMap) => parkingMap.parkingPlaces)
  parkingMap: ParkingMap;
}
