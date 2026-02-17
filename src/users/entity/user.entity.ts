import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { Role } from './role.entity';
import { AppointmentPatient } from '../../appointments/entity/appointmentPatient.entity';
import { AppointmentTherapist } from '../../appointments/entity/appointmentTherapist.entity';
import { TherapistNote } from '../../appointments/entity/therapist-notes.entity';
import { PatientProfile } from '../../profile/entity/patientProfile.entity';
import { TherapistProfile } from '../../profile/entity/therapistProfile.entity';
import { Payment } from '../../payment/entity/payment.entity';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => PatientProfile, patientProfile => patientProfile.user, { nullable: true })
  patientProfile: PatientProfile;

  @OneToOne(() => TherapistProfile, therapistProfile => therapistProfile.user, { nullable: true })
  therapistProfile: TherapistProfile;

  @OneToMany(() => AppointmentPatient, (appointmentPatient) => appointmentPatient.patient, { nullable: true })
  patientAppointments?: AppointmentPatient[];

  @OneToMany(() => AppointmentTherapist, (appointmentTherapist) => appointmentTherapist.therapist, { nullable: true })
  therapistAppointments?: AppointmentTherapist[];

  @OneToMany(() => TherapistNote, (note) => note.therapist)
  therapistNotes: TherapistNote[];

  @OneToMany(() => Payment, (payment) => payment.patient, { nullable: true })
  payments: Payment[]

  @Column({type: 'varchar', nullable: true })
  resetPasswordToken?: string | null;

  @Column({ type: 'timestamp with time zone', nullable: true })
  resetPasswordExpires?: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
