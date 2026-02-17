import {
  Controller,
  Post,
  Body,
  Header,
  Headers,
  UseGuards,
  Request
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { StripeService } from './stripe.service';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../users/guards/jwt-auth.guard';
import { RolesGuard } from '../users/guards/role.guard';
import { Roles } from '../users/guards/roles.decorator';
import { RoleEnum } from '../utils/data/roles';
import { CreateStripePaymentDto, StripePaymentResponseDto } from './dto/stripe.dto';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly stripeService: StripeService,
  ) {}

  @Post('/stripe/create-payment-intent')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleEnum.Patient)
  @ApiOperation({ summary: 'Create a payment intent in stripe' })
  @ApiBody({ type: CreateStripePaymentDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Payment successfully created',
    type: StripePaymentResponseDto,
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Bad request' 
  })
  async createPaymentIntent(
    @Body() body: CreateStripePaymentDto, @Request() req
  ) {
    return this.stripeService.createPaymentIntent(
      req.user.id,
      body.appointmentId,
      body.amount,
    );
  }

  @Post('webhook')
  @Header('Content-Type', 'application/json')
  async handleWebhook(
    @Body() rawBody: Buffer,
    @Headers('stripe-signature') signature: string,
  ) {
    return this.stripeService.handleWebhook(rawBody, signature);
  }
}
