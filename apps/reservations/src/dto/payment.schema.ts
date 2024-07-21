import { Prop, Schema } from "@nestjs/mongoose"
import { IsNumber, IsString } from "class-validator";

@Schema()
export class Payment { 
    
   @IsNumber()
   amount:number;

   @IsString()
   pname:string;

   @IsNumber()
   quantity:number;
}