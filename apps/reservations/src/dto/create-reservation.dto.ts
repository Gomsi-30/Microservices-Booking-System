import { Type } from "class-transformer";
import { IsDate, IsDefined, IsNotEmpty, IsNotEmptyObject, IsNumber, Min, ValidateNested } from "class-validator";
import { Payment } from "./payment.schema";

export class CreateReservationDto {
   
    @IsDate()
    @IsNotEmpty()
    @Type(()=>Date)
    startDate: Date;
  
    @IsDate()
    @Type(()=>Date)
    @IsNotEmpty()
    endDate: Date;
  
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    rooms: number;
  
    @IsNumber()
    @Min(1)
    @IsNotEmpty()
    peoples: number;

    @IsDefined()
    @IsNotEmptyObject()
    @ValidateNested()
    @Type(()=>Payment)
    charge:Payment;

}
