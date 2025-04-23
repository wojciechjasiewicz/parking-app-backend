export class GetParkingMapListItemDto {
  id: number;
  name: string;
}

export class GetPakingMapListDto {
  parkingMaps: GetParkingMapListItemDto[];
}
