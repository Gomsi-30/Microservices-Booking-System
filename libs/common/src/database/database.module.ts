import { Module } from "@nestjs/common";
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
   imports:[MongooseModule.forRootAsync({
     useFactory : (configService : ConfigService)=>({   
       uri : configService.get<string>('MONGO_URI')
     }),
     inject:[ConfigService]
   })]
})

export class DatabaseModule {
  static forFeature(model:ModelDefinition[]){
    return MongooseModule.forFeature(model);
  }
}