import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { GetUserListDto } from './get-user-list.dto';
import { GetUserDto } from './get-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepositiry: Repository<User>,
  ) {}

  async findAll(): Promise<GetUserListDto> {
    const users = await this.userRepositiry.find({
      select: { id: true, name: true, surname: true },
    });

    return {
      users: users.map(({ id, name, surname }) => ({ id, name, surname })),
    };
  }

  async findById(id: number): Promise<GetUserDto> {
    const user = await this.userRepositiry.findOne({
      select: { id: true, name: true, surname: true },
      where: { id },
    });

    return {
      id: user.id,
      name: user.name,
      surname: user.surname,
    };
  }
}
