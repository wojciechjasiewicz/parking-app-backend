export class MapDto {
  id: number;
  name: string;
}
export class GetOfficeDto {
  id: number;
  name: string;
  maps: MapDto[];
}
