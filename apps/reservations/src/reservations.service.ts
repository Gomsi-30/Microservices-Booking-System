import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationRepository } from './reservation.repository';
import { UsersDto } from 'apps/auth/src/users/dto/users.dto';
import { ClientProxy } from '@nestjs/microservices';
import { PAYMENT_SERVICE } from '@app/common';
import { map, tap } from 'rxjs';

@Injectable()
export class ReservationsService {
  constructor(private readonly reservationService: ReservationRepository,@Inject(PAYMENT_SERVICE) readonly paymentService:ClientProxy) {}
  create(createReservationDto: CreateReservationDto,{email,_id,name}) {
    return this.paymentService.send('payments',{
       ...createReservationDto.charge,
       ...createReservationDto,
       email,
       name
    })
    .pipe(
      map((res)=>{
        console.log(res)
        // console.log(res)
          return this.reservationService.create({
          ...createReservationDto,
          timestamp: new Date(),
          userId:_id,
          invoiceId:res.id
      })
      // return res.id;
      })
    )
  }

  // findAll(data:any,user:) {
   
  // }

  findOne(_id: string) {
    return this.reservationService.findOne({_id});
  }

  update(_id: string, updateReservationDto: UpdateReservationDto) {
    return this.reservationService.findOneAndUpdate({_id}, {$set:updateReservationDto});
  }

  remove(_id: string) {
    return this.reservationService.findOneAndDelete({_id});
  }
}
