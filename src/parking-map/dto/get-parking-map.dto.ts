export class GetParkingMapDto {
  id: number;

  name: string;
  groupName: string;

  fileType: string;

  data: string;

  parkingPlaces: {
    id: number;
    label: string;
    positionX: number;
    positionY: number;
  }[] = [];
}
