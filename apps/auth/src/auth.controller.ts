import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './Guards/LocalGuard';
import { Response } from 'express';
import { CurrentUser } from '@app/common';
import { UsersDocument } from './users/entity/users.schema';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtGuard } from './Guards/JwtGuard';

@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @UseGuards(LocalGuard)
  @Post('login')
  async login(@CurrentUser() user:UsersDocument,@Res({passthrough:true}) res:Response){
     const a = await this.authService.createToken(user,res);
     return {token:a}
  }

  @UseGuards(JwtGuard)
  @MessagePattern('authenticate')
  async authenticate(@Payload() data:any){
     console.log(data)
     return data.user;
  }
}
