import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { StripeService } from './stripe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entity/user.entity';
import { Appointment } from '../appointments/entity/appointment.entity';
import { Payment } from './entity/payment.entity';
import { MailModule } from '../mail/mail.module';
import { MailService } from '../mail/mail.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Appointment, Payment]), MailModule],
  controllers: [PaymentController],
  providers: [PaymentService, StripeService, MailService],
})
export class PaymentModule {}
