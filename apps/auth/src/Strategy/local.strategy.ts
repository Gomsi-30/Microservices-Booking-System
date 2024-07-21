import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from "../users/users.service";
import { Injectable } from "@nestjs/common";
import { Strategy } from "passport-local";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy,'local') {
   constructor(private readonly usersService: UsersService) {
    super({usernameField:'email'}) //. Agar aapke form me username ke badle email field use hota hai, to aapko strategy ko yeh batana padta hai. Isliye hum { usernameField: 'email' } object pass karte hain, jo strategy ko specify karta hai ki username ke badle email field use karni hai.
   }

   async validate(email:string, password:string) {
      return await this.usersService.confirm(email, password)
   }
}