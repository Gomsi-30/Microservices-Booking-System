import { Controller, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @MessagePattern('payments')
  async payments(@Payload() data:any){
    // console.log(data.nam)
    return this.paymentsService.createCheckoutSession(data)
  }
}
