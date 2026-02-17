import { User } from "../../users/entity/user.entity"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
    JoinColumn,
  } from 'typeorm';
import { Appointment } from './appointment.entity';
  
  @Entity('therapist_notes')
  export class TherapistNote {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Appointment, (appointment) => appointment.therapistNotes)
    @JoinColumn()
    appointment: Appointment;
  
    @ManyToOne(() => User, (user) => user.therapistNotes)
    @JoinColumn()
    therapist: User;
  
    @Column('text')
    note: string;

    @Column({ default: false }) // Show to patient?
    isVisibleToPatient: boolean;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  