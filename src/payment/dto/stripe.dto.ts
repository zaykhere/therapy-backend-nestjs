import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateStripePaymentDto {
  @ApiProperty({
    description: 'ID of the appointment being paid for',
    example: 42,
  })
  @IsNumber()
  appointmentId: number;

  @ApiProperty({
    description: 'Payment amount',
    example: 99.99,
  })
  @IsNumber()
  amount: number;
}

export class StripePaymentResponseDto {
  @ApiProperty({
    description: 'Client secret for confirming the payment on the client side',
    example: 'pi_3LNtTY2eZvKYlo2C0hVh6XJQ_secret_3g2vV6XJQhVh6XJQhVh6XJQh',
    type: String,
  })
  clientSecret: string;

  @ApiProperty({
    description: 'ID of the created payment record',
    example: 12345,
    type: Number,
  })
  paymentId: number;
}