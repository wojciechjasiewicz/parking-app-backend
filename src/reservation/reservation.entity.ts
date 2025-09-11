import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  parkingPlaceId: number

  @Column()
  userId: number

  @Column()
  date: Date
}
