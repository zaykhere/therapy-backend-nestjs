import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { TherapistNotesRepository } from './repository/therapistNotes/therapistNotes.repository';
import { AppointmentsService } from './appointments.service';
import { CreateTherapistNoteDto, UpdateTherapistNoteDto } from './dto/therapist-notes.dto';
import { TherapistNote } from './entity/therapist-notes.entity';
import { Appointment } from './entity/appointment.entity';
import { UsersRepository } from '../users/repository/users.repository';
import { RoleEnum } from '../utils/data/roles';

@Injectable()
export class TherapistNotesService {
  constructor(
    private readonly repository: TherapistNotesRepository,
    private readonly appointmentService: AppointmentsService,
    private readonly usersRepository: UsersRepository,
  ) {}

  async create(therapistId: number, dto: CreateTherapistNoteDto): Promise<TherapistNote> {
    const appointment = await this.appointmentService.findOne(dto.appointmentId, true) as Appointment;
    if (!appointment) throw new NotFoundException('Appointment not found');

    const therapist = await this.usersRepository.findById(therapistId);
    if (!therapist) throw new NotFoundException('Therapist not found');

    // Ensure therapist belongs to the appointment
    if (!appointment.therapists || !appointment.therapists.some((t) => t.id === therapistId)) {
      throw new ForbiddenException('You are not assigned to this appointment');
    }

    const note = this.repository.save({
      therapist,
      appointment,
      note: dto.note,
      isVisibleToPatient: dto.isVisibleToPatient
    });

    return note;
  }

  async findByAppointment(appointmentId: number, userId: number, role: RoleEnum): Promise<TherapistNote[]> {
    const notes = await this.repository.findByAppointment(appointmentId);

    if(notes.length > 0) return [];

    let note = notes[0];

    if(role === RoleEnum.Patient) {
      if(note.appointment.patients && note.appointment.patients.length > 0) {
        if(note.appointment.patients.some((t) => t.id === userId) && note.isVisibleToPatient === true) return notes;
        else [];
      }
    }

    else if(role === RoleEnum.Therapist) {
      if(note.therapist.id === userId) return notes;
      else [];
    }

    return [];
  }

  async update(id: number, dto: UpdateTherapistNoteDto): Promise<TherapistNote> {
    const note = await this.repository.findById(id);
    if (!note) throw new NotFoundException('Note not found');

    note.note = dto.note;
    return this.repository.save(note);
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
