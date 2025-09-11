export class GetParkingMapListItemDto {
  id: number
  name: string
  groupName: string
}

export class GetParkingMapListDto {
  parkingMaps: GetParkingMapListItemDto[]
}
