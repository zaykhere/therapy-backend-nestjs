import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Appointment } from "../entity/appointment.entity";
import { AppointmentRepository } from "./appointment.repository";
import { AppointmentPatient } from "../entity/appointmentPatient.entity";
import { AppointmentTherapist } from "../entity/appointmentTherapist.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Appointment, AppointmentPatient, AppointmentTherapist])],
    providers: [AppointmentRepository],
    exports: [AppointmentRepository],
})
export class AppointmentPersistenceModule { }