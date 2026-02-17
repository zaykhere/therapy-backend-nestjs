import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TherapistNote } from "../../entity/therapist-notes.entity";
import { Repository } from 'typeorm';

@Injectable()
export class TherapistNotesRepository {
  constructor(
    @InjectRepository(TherapistNote)
    private readonly repository: Repository<TherapistNote>,
  ) {}

  async save(note: Partial<TherapistNote>): Promise<TherapistNote> {
    const obj = this.repository.create(note);
    return this.repository.save(obj);
  }

  async findById(id: number): Promise<TherapistNote | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByAppointment(appointmentId: number): Promise<TherapistNote[]> {
    return this.repository.find({ where: { appointment: { id: appointmentId } }, relations: {
      appointment: {
        patients: true,
        therapists: true,
      },
      therapist: true,
    } });
  }

  async delete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
