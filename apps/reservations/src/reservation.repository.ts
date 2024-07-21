import { AbstractRepository } from "@app/common/database";
import { InjectModel } from "@nestjs/mongoose";
import { ReservationDocument } from "./entities/reservation.entity";
import { Model } from "mongoose";
import { Logger } from "@nestjs/common";

export class ReservationRepository extends AbstractRepository<ReservationDocument> {
    public readonly logger:Logger;
    constructor(@InjectModel(ReservationDocument.name) reservationModel: Model<ReservationDocument>) {
        super(reservationModel)
    }
}