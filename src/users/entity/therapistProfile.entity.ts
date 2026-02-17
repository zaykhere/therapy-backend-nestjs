import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('therapist_profiles')
export class TherapistProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    specialization: string;

    @Column({ nullable: true })
    licenseNumber: string;

    @Column({ nullable: true })
    yearsOfExperience: number;

    @OneToOne(() => User, user => user.therapistProfile)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}