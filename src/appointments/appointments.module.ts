import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entity/appointment.entity';
import { AppointmentPatient } from './entity/appointmentPatient.entity';
import { AppointmentTherapist } from './entity/appointmentTherapist.entity';
import { TherapyTypePersistenceModule } from '../therapy-type/repository/persistence-module';
import { UserPersistenceModule } from '../users/repository/persistence.module';
import { AppointmentPersistenceModule } from './repository/persistence-module';
import { MailModule } from '../mail/mail.module';
import { TherapistNotesController } from './therapistNotes.controller';
import { TherapistNotesService } from './therapist-notes.service';
import { TherapistNotesPersistenceModule } from './repository/therapistNotes/persistence-module';
import { TherapistNotesRepository } from './repository/therapistNotes/therapistNotes.repository';
import { MeetingService } from './meeting.service';
import { HttpModule, HttpService } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, AppointmentPatient, AppointmentTherapist]),
    TherapyTypePersistenceModule,
    UserPersistenceModule,
    AppointmentPersistenceModule,
    MailModule,
    TherapistNotesPersistenceModule,
    HttpModule
  ],
  controllers: [AppointmentsController, TherapistNotesController],
  providers: [AppointmentsService, TherapistNotesService, TherapistNotesService, MeetingService],
})
export class AppointmentsModule {}
