import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UsersDocument } from './users/entity/users.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(private readonly jwt : JwtService,private readonly config : ConfigService) {}
 
  async createToken(user:UsersDocument,res:Response){
    const payload = {
      userId : user.email
    }
    console.log(payload);
    const expires = new Date();
    expires.setSeconds(
       expires.getSeconds() + this.config.get('JWT_EXPIRATION')
    )
      const token = this.jwt.sign(payload)

      res.cookie('Authentication', token, {
        httpOnly: true,
        expires,
      })
      console.log(token)
      return token;
  }
}
