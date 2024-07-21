import { IsEmail, IsString, IsStrongPassword } from "class-validator";

export class UsersDto {
   
    @IsString()
    name: string;
 
    @IsEmail()
    email: string;
 
    @IsStrongPassword()
    password: string;
}