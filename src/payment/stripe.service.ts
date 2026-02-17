import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Payment, PaymentProviderEnum, PaymentStatusEnum } from './entity/payment.entity';
import { User } from '../users/entity/user.entity';
import { Appointment } from '../appointments/entity/appointment.entity';
import { ConfigService } from '@nestjs/config';
import { MailService } from '../mail/mail.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private configService: ConfigService,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
    private readonly mailService: MailService
  ) {
    this.stripe = new Stripe(this.configService.get('STRIPE_SECRET_KEY') as string , {
      // @ts-ignore
      apiVersion: null, // Use the latest API version
    });
  }

  async createPaymentIntent(
    userId: number, 
    appointmentId: number, 
    amount: number
  ) {
    try {
      // Verify user and appointment exist
      const user = await this.userRepository.findOne({ 
        where: { id: userId } 
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const appointment = await this.appointmentRepository.findOne({ 
        where: { id: appointmentId },
        relations: ['payments']
      });
      if (!appointment) {
        throw new BadRequestException('Appointment not found');
      }

      if(appointment.payments && appointment.payments.length > 0) {
        appointment.payments.forEach((p) => {
          if(p.appointment.id === appointmentId && p.status === PaymentStatusEnum.PAID) {
            throw new BadRequestException('Appointment has already been paid for.')
          }
        })
      }

      // Create Stripe payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          userId: userId.toString(),
          appointmentId: appointmentId.toString(),
          email: user.email
        },
      });

      // Create a payment record in the database
      const payment = this.paymentRepository.create({
        patient: user,
        appointment: appointment,
        provider: PaymentProviderEnum.STRIPE,
        amount: amount,
        status: PaymentStatusEnum.PENDING,
        paymentIntentId: paymentIntent.id
      });

      await this.paymentRepository.save(payment);

      return {
        clientSecret: paymentIntent.client_secret,
        paymentId: payment.id,
      };
    } catch (error) {
      throw new BadRequestException(`Stripe payment error: ${error.message}`);
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET') as string
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handleSuccessfulPayment(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handleFailedPayment(event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }
  }

  private async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
    const { userId, appointmentId, email } = paymentIntent.metadata;

    // Update payment status in database if needed
    const payment = await this.paymentRepository.findOne({
      where: { 
        paymentIntentId: paymentIntent.id
      }
    });

    if (payment) {
      // You might want to add a status column to your Payment entity
      payment.status = PaymentStatusEnum.PAID;
      await this.paymentRepository.save(payment);
      await this.mailService.sendMail(email, "Payment Processed", "Your payment has been processed successfully");
    }
  }

  private async handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
    const { userId, appointmentId, email } = paymentIntent.metadata;

    const payment = await this.paymentRepository.findOne({
      where: { 
        paymentIntentId: paymentIntent.id
      }
    });

    if(payment) {
      payment.status = PaymentStatusEnum.FAILED
      await this.paymentRepository.save(payment);
    }

    // Log or handle failed payment
    console.log(`Payment failed for user ${userId}, appointment ${appointmentId}`);

    await this.mailService.sendMail(email, "Payment Failed", "Your payment has failed to be processed")
  }
}