import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entity/user.entity';
import { Appointment } from './appointment.entity';

@Entity('appointment_patients')
export class AppointmentPatient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Appointment, (appointment) => appointment.patients, { nullable: true })
  @JoinColumn()
  appointment?: Appointment;

  @ManyToOne(() => User, (user) => user.patientAppointments, { nullable: true })
  @JoinColumn()
  patient?: User;
}