import { IsNotEmpty, IsString } from 'class-validator'
export class AddParkingMapDto {
  @IsNotEmpty()
  @IsString()
  name!: string

  @IsNotEmpty()
  @IsString()
  svgData!: string
}
