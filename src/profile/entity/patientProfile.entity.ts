import { User } from "../../users/entity/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity('patient_profiles')
export class PatientProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    dateOfBirth: Date;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    phoneNumber: string;

    @OneToOne(() => User, user => user.patientProfile)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}