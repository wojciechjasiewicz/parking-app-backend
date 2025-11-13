import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
// User entity represents a user in the system
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  surname: string
}
