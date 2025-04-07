import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUserListDto } from './get-user-list.dto';
import { GetUserDto } from './get-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<GetUserListDto> {
    return await this.usersService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUserDto> {
    return await this.usersService.findById(id);
  }
}
