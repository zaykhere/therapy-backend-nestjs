import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PatientProfile } from "../entity/patientProfile.entity";
import { TherapistProfile } from "../entity/therapistProfile.entity";
import { PatientProfileRepository } from "./patient-profile.repository";
import { TherapistProfileRepository } from "./therapist-profile.repository";

@Module({
    imports: [TypeOrmModule.forFeature([PatientProfile, TherapistProfile])],
    providers: [PatientProfileRepository, TherapistProfileRepository],
    exports: [PatientProfileRepository, TherapistProfileRepository],
})
export class ProfilePersistenceModule { }