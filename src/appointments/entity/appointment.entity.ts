import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TherapyType } from '../../therapy-type/entity/therapy-type.entity';
import { AppointmentPatient } from './appointmentPatient.entity';
import { AppointmentTherapist } from './appointmentTherapist.entity';
import { TherapistNote } from './therapist-notes.entity';
import { Payment } from '../../payment/entity/payment.entity';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => AppointmentPatient, (appointmentPatient) => appointmentPatient.appointment, { nullable: true })
  patients?: AppointmentPatient[];

  @OneToMany(() => AppointmentTherapist, (appointmentTherapist) => appointmentTherapist.appointment, { nullable: true })
  therapists?: AppointmentTherapist[];

  @ManyToOne(() => TherapyType)
  @JoinColumn()
  therapyType: TherapyType;

  @OneToMany(() => TherapistNote, (note) => note.appointment)
  therapistNotes: TherapistNote[];

  @OneToMany(() => Payment, (payment) => payment.appointment)
  payments: Payment[]

  @Column({ type: 'int' })
  duration: number; // Duration in minutes

  @Column({ type: 'timestamp with time zone' })
  scheduledAt: Date;

  @Column({ type: 'boolean', default: false })
  isCompleted: boolean;

  @Column({ type: 'varchar', nullable: true })
  meetingUrl?: string;

  @Column({ type: 'boolean', default: false })
  isConfirmed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
