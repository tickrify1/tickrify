import {
  Controller,
  Post,
  Get,
  Body,
  Headers,
  RawBodyRequest,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Criar sessão de checkout
   */
  @Post('create-checkout-session')
  @UseGuards(/* AuthGuard */)
  async createCheckoutSession(
    @CurrentUser() user: any,
    @Body() body: { planType: string; successUrl: string; cancelUrl: string },
  ) {
    return this.stripeService.createCheckoutSession(
      user.id,
      body.planType as any,
      body.successUrl,
      body.cancelUrl,
    );
  }

  /**
   * Criar portal do cliente
   */
  @Post('create-customer-portal')
  @UseGuards(/* AuthGuard */)
  async createCustomerPortal(
    @CurrentUser() user: any,
    @Body() body: { returnUrl: string },
  ) {
    return this.stripeService.createCustomerPortal(user.id, body.returnUrl);
  }

  /**
   * Cancelar assinatura
   */
  @Post('cancel-subscription')
  @UseGuards(/* AuthGuard */)
  async cancelSubscription(@CurrentUser() user: any) {
    return this.stripeService.cancelSubscription(user.id);
  }

  /**
   * Reativar assinatura
   */
  @Post('reactivate-subscription')
  @UseGuards(/* AuthGuard */)
  async reactivateSubscription(@CurrentUser() user: any) {
    return this.stripeService.reactivateSubscription(user.id);
  }

  /**
   * Obter assinatura do usuário
   */
  @Get('subscription')
  @UseGuards(/* AuthGuard */)
  async getUserSubscription(@CurrentUser() user: any) {
    return this.stripeService.getUserSubscription(user.id);
  }

  /**
   * Webhook do Stripe
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    if (!signature) {
      throw new Error('Missing stripe-signature header');
    }

    const rawBody = request.rawBody;
    if (!rawBody) {
      throw new Error('Missing raw body');
    }

    return this.stripeService.handleWebhookEvent(signature, rawBody);
  }
}

