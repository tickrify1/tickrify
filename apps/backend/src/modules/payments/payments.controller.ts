import { Controller, Post, Body, UseGuards, Req, Headers, RawBodyRequest } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../database/prisma.service';

@Controller('payments')
export class PaymentsController {
  constructor(
    private paymentsService: PaymentsService,
    private prisma: PrismaService,
  ) {}

  @Post('create-checkout')
  @UseGuards(AuthGuard)
  async createCheckout(
    @CurrentUser() user: { clerkUserId: string },
    @Body() body: { priceId: string; mode: 'payment' | 'subscription' },
  ) {
    const dbUser = await this.prisma.user.findUnique({
      where: { clerkUserId: user.clerkUserId },
    });

    return this.paymentsService.createCheckoutSession(dbUser!.id, body.priceId, body.mode);
  }

  @Post('webhooks/stripe')
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: RawBodyRequest<Request>,
  ) {
    return this.paymentsService.handleWebhook(signature, req.rawBody!);
  }
}

