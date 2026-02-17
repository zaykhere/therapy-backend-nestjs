import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Appointment } from './appointment.entity';

@Entity('appointment_therapists')
export class AppointmentTherapist {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.therapists, { nullable: true })
  @JoinColumn()
  appointment?: Appointment;

  @ManyToOne(() => User, (user) => user.therapistAppointments, { nullable: true })
  @JoinColumn()
  therapist?: User;
}
