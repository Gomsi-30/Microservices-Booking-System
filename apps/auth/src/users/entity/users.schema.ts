import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes, Types } from "mongoose";

@Schema()
export class UsersDocument {

   @Prop()
   name: string;

   @Prop()
   email: string;

   @Prop()
   password: string;

   @Prop({required:false})
   tempToken:number;
}

export const UsersSchema = SchemaFactory.createForClass(UsersDocument);