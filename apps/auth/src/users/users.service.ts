import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UsersDto } from './dto/users.dto';
import * as bcrypt from 'bcrypt';
import { UsersDocument } from './entity/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetUserDto } from './dto/get-user.dto';
import { NOTIFICATION_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository,@InjectModel(UsersDocument.name) private readonly users:Model<UsersDocument>,@Inject(NOTIFICATION_SERVICE) readonly notify:ClientProxy) {}

  async create(usersData: UsersDto) {
    const already = await this.users.findOne({
      email: usersData.email,
    });
    if (already) {
      // this.usersRepository.logger.warn('User exist')
      throw new ConflictException('User Already Exist');
    }
    const newPassword = await bcrypt.hash(usersData.password, 10);
    const newUser = await this.usersRepository.create({
      ...usersData,
      password: newPassword,
    });
    
    if (!newUser) {
      throw new ConflictException('User creation failed');
    }

    return newUser;
  }

  async confirm(email:string, password:string){
    const user = await this.usersRepository.findOne({email});
    if(!user){
     throw new UnauthorizedException('User Not found');
    }
    const result = await bcrypt.compare(password, user.password)
    if(!result){
     throw new UnauthorizedException('Password mismatch');
    }
    return user;
 }
 
 async changePassword({oldPassword, newPassword} , user:UsersDocument){
   const verify = this.usersRepository.findOne({email:user.email})
   if(!verify){
    throw new UnauthorizedException('User does not exist')
   }

   const password = await bcrypt.compare(oldPassword,user.password);
   if(!password){
    throw new UnauthorizedException('Password does not match')
   }
   const newPass = await bcrypt.hash(newPassword,10);
   const newUser = await this.usersRepository.findOneAndUpdate({email:user.email},{$set:{newPass}})
   return newUser;
 }

  getUser(getuserdto:GetUserDto) {
    console.log('services...')
    return this.usersRepository.findOne({email:getuserdto.email});
  }

 async forgot(email:string){
   const user = await this.usersRepository.findOne({email});
   if(!user){
    throw new NotFoundException('User not exist');
   }

   const token = 123;
   await this.usersRepository.findOneAndUpdate({email},{$set:{tempToken:token}})
   this.notify.emit('forgot',{token,email})
   return 'Link send to your email succesfully....'
 }

 async final(token:number,newPass:string){
  console.log(token);
  
    const match = await this.users.findOne({tempToken:token});
    if(!match){
      throw new UnauthorizedException('Token not matched')
    }
    const a = await bcrypt.hash(newPass, 10);
  
    const  b = await this.usersRepository.findOneAndUpdate({tempToken:token},{$set:{password:a,tempToken:undefined}})
    return b;
 }
}
