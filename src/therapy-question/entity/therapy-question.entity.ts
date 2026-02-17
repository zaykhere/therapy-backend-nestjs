import { TherapyType } from '../../therapy-type/entity/therapy-type.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('therapy_questions')
export class TherapyQuestion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text' })
    question: string;

    // @ManyToOne(() => TherapyType, (therapyType) => therapyType.questions, { onDelete: 'CASCADE' })
    // @JoinColumn({ name: 'therapy_type_id' })
    // therapyType: TherapyType;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}