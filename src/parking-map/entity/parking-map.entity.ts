import { ParkingPlace } from "./parking-place.entity";
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";

@Entity()
export class ParkingMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  groupName: string;

  @Column({ type: "varchar", length: 255 })
  fileType: string;

  @Column({ type: "bytea" })
  data: Buffer;

  @OneToMany(() => ParkingPlace, (parkingPlace) => parkingPlace.parkingMap)
  parkingPlaces: ParkingPlace[];
}
