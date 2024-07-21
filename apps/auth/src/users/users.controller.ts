import { Body, Controller, Get, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersDto } from './dto/users.dto';
import { JwtGuard } from '../Guards/JwtGuard';
import { CurrentUser } from '@app/common';
import { UsersDocument } from './entity/users.schema';
import { GetUserDto } from './dto/get-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/create')
  async create(@Body() usersData: UsersDto) {
    return await this.usersService.create(usersData);
  }
 
  @Get('/profile')
  @UseGuards(JwtGuard)
  async getUser(@CurrentUser() user: UsersDocument) {
    return user;
  }

  @UseGuards(JwtGuard)
  @Post('/change')
  async changePassword(@Body() data,@CurrentUser() user:UsersDocument){
      return this.usersService.changePassword(data,user);
  }

  @Post('/forgot')
  async forgot(@Body() data:GetUserDto){
    return this.usersService.forgot(data.email);
  }

  @Post('/reset-password')
  async final(  @Query('token',ParseIntPipe) token: number,@Body("newPass") newPass ){
    console.log(typeof token)
    return this.usersService.final(token,newPass);
  }
}
