export class GetUserListItemDto {
  id: number;
  name: string;
  surname: string;
}

export class GetUserListDto {
  users: GetUserListItemDto[];
}
