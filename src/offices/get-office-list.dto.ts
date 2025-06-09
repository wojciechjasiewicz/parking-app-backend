export class GetOfficeListItemDto {
  id: number;
  name: string;
}

export class GetOfficeListDto {
  offices: GetOfficeListItemDto[];
}
