import { ParkingPlace } from 'src/parking-places/parking-place.entity';
import { Office } from 'src/offices/office.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class ParkingMap {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  fileType: string;

  @Column({ type: 'bytea' })
  data: Buffer;

  @OneToMany(() => ParkingPlace, (parkingPlace) => parkingPlace.parkingMap)
  parkingPlaces: ParkingPlace[];

  @ManyToOne(() => Office, (office) => office.parkingMaps)
  office: Office;
}
