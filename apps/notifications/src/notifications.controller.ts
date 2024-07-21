import { Controller, Get } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @MessagePattern('message')
  async message(data){
     this.notificationsService.sending(data);
  }

  @MessagePattern('forgot')
  async forgot(data){
     this.notificationsService.forgot(data);
  }
}
