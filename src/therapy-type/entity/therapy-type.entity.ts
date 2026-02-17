import { Appointment } from '../../appointments/entity/appointment.entity';
import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity('therapy_types')
export class TherapyType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => Appointment, (appointment) => appointment.therapyType)
  appointment: Appointment[];

  // @OneToMany(() => TherapyQuestion, (question) => question.therapyType, { cascade: true })
  // questions: TherapyQuestion[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
