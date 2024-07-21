import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class ReservationDocument {
  @Prop()
  userId:string;
  
  @Prop({type: Date})
  timestamp: Date;
  
  @Prop({ required: true, type: Date })
  startDate: Date;

  @Prop({ required: true, type: Date })
  endDate: Date;

  @Prop({ required: true, type: Number, min: 1 })
  rooms: number;

  @Prop({ required: true, type: Number, min: 1 })
  peoples: number;

  @Prop()
  invoiceId: string;

}

export const ReservationSchema = SchemaFactory.createForClass(ReservationDocument);

