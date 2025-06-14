import { ParkingPlace } from './parking-place.entity';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class ParkingMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  groupName: string;

  @Column()
  fileType: string;

  @Column({ type: 'bytea' })
  data: Buffer;

  @OneToMany(() => ParkingPlace, (parkingPlace) => parkingPlace.parkingMap)
  parkingPlaces: ParkingPlace[];
}
