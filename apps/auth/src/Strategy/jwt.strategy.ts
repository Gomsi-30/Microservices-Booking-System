
import { PassportStrategy } from '@nestjs/passport';
import {  ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { Token } from '../Interface/Token';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
   constructor(configService:ConfigService,private readonly usersService: UsersService){
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request:any)=>
          request?.cookies?.Authentication || request?.Authentication || request?.headers?.authorization?.split(' ')[1]
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET'), 
    })
    console.log('hello')
  }
   
    async validate({ userId }:Token) {
        console.log("hello" + userId)
        return await this.usersService.getUser({email:userId});
    }
}