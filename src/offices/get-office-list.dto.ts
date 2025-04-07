export class GetOfficeLisItemtDto {
  id: number;
  name: string;
}

export class GetOfficeListDto {
  offices: GetOfficeLisItemtDto[];
}
