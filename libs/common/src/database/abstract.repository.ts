import { Logger, NotFoundException } from "@nestjs/common";
import { FilterQuery, Model, Types, UpdateQuery } from "mongoose";


export abstract class AbstractRepository<T>{
    protected abstract readonly logger : Logger;
    constructor(private readonly model : Model<T>){}  

    async create(data:Partial<T>):Promise<T>{
      return await this.model.create(data);
    }

    async findOne(filter: FilterQuery<T>):Promise<T>{
        const data = await this.model.findOne(filter)
        .lean<T>(true);
        if(!data){
        //    this.logger.warn('Document not found'+filter);
           throw new NotFoundException('Document not found...');
        }
        return data;
    }

    async find():Promise<T[]>{
        const all = await this.model.find()
        .lean<T[]>(true);

        if(!all){
            // this.logger.error('Document Not Found'+10)
            throw new NotFoundException('Not found....')
        }
        return all;
    }

    async findOneAndUpdate(filter: FilterQuery<T>, updateData: UpdateQuery<T>):Promise<T>{
        const updatedDocument = await this.model.findOneAndUpdate(filter,updateData,{
            new: true
        }).lean<T>(true);

        if(!updatedDocument){
            // this.logger.warn('Document not found with filter id:' + filter);
            throw new NotFoundException('Document not found');
         }
         return updatedDocument;
    }

    async findOneAndDelete(filter:FilterQuery<T>):Promise<T>{
        return await this.model.findOneAndDelete(filter)
        .lean<T>(true);
    }
}