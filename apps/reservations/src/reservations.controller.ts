import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { CommonGuard, CurrentUser } from '@app/common';
import { UsersDocument } from 'apps/auth/src/users/entity/users.schema';
import { UsersDto } from 'apps/auth/src/users/dto/users.dto';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @UseGuards(CommonGuard)
  @Post()
  create(@Body() createReservationDto,@CurrentUser() user) {
    console.log(createReservationDto)
    console.log(user.password);
    
    return this.reservationsService.create(createReservationDto,user);
  }

  // @UseGuards(CommonGuard)
  // @Post('profile')
  // pay(@Body() data,@CurrentUser() user:UsersDto) {
  //   return this.reservationsService.findAll(data.user);
  // }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(id);
  }
}
