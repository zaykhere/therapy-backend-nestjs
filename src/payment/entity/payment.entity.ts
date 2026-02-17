import { Entity, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, JoinColumn } from "typeorm";
import {User} from "../../users/entity/user.entity";
import { Appointment } from "../../appointments/entity/appointment.entity";

export enum PaymentProviderEnum {
  STRIPE = 1,
  PAYPAL = 2
  // Add more as needed
}

export enum PaymentStatusEnum {
  PAID = 1,
  PENDING = 2,
  REFUND = 3,
  FAILED = 4
}

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  @JoinColumn()
  patient: User;

  @ManyToOne(() => Appointment, { eager: true })
  @JoinColumn()
  appointment: Appointment;

  @Column({type: 'int'})
  provider: PaymentProviderEnum;

  @Column({type: 'int'})
  status: PaymentStatusEnum;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({type: 'text', nullable: true})
  paymentIntentId?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
