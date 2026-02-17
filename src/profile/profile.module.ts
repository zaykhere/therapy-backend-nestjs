import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientProfile } from './entity/patientProfile.entity';
import { TherapistProfile } from './entity/therapistProfile.entity';
import { PatientProfileController } from './patientProfile.controller';
import { ProfileService } from './profile.service';
import { PatientProfileRepository } from './repository/patient-profile.repository';
import { TherapistProfileRepository } from './repository/therapist-profile.repository';
import { TherapistProfileController } from './therapistProfile.controller';
import { ProfilePersistenceModule } from './repository/persistence-module';

@Module({
  imports: [TypeOrmModule.forFeature([PatientProfile, TherapistProfile]), ProfilePersistenceModule],
  controllers: [PatientProfileController, TherapistProfileController],
  providers: [ProfileService, PatientProfileRepository, TherapistProfileRepository],
  exports: [ProfileService],
})
export class ProfileModule {}
