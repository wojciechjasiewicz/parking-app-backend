import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common'
import type { UsersService } from './users.service'
import type { GetUserListDto } from './get-user-list.dto'
import type { GetUserDto } from './get-user.dto'

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<GetUserListDto> {
    return await this.usersService.findAll()
  }

  @Get('/:id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<GetUserDto> {
    return await this.usersService.findById(id)
  }
}
