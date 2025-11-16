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
import { AuthGuard } from '../auth/auth.guard';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  /**
   * Criar sessão de checkout
   */
  @Post('create-checkout-session')
  @UseGuards(AuthGuard)
  async createCheckoutSession(
    @CurrentUser() user: any,
    @Body() body: { planType: string; successUrl: string; cancelUrl: string },
  ) {
    return this.stripeService.createCheckoutSession(
      user.clerkUserId,
      body.planType as any,
      body.successUrl,
      body.cancelUrl,
    );
  }

  /**
   * Criar portal do cliente
   */
  @Post('create-customer-portal')
  @UseGuards(AuthGuard)
  async createCustomerPortal(
    @CurrentUser() user: any,
    @Body() body: { returnUrl: string },
  ) {
    return this.stripeService.createCustomerPortal(user.clerkUserId, body.returnUrl);
  }

  /**
   * Cancelar assinatura
   */
  @Post('cancel-subscription')
  @UseGuards(AuthGuard)
  async cancelSubscription(@CurrentUser() user: any) {
    return this.stripeService.cancelSubscription(user.clerkUserId);
  }

  /**
   * Reativar assinatura
   */
  @Post('reactivate-subscription')
  @UseGuards(AuthGuard)
  async reactivateSubscription(@CurrentUser() user: any) {
    return this.stripeService.reactivateSubscription(user.clerkUserId);
  }

  /**
   * Obter assinatura do usuário
   */
  @Get('subscription')
  @UseGuards(AuthGuard)
  async getUserSubscription(@CurrentUser() user: any) {
    return this.stripeService.getUserSubscription(user.clerkUserId);
  }

  /**
   * Webhook do Stripe
   * IMPORTANTE: Sempre retorna 200 para evitar que o Stripe reenvie o webhook
   */
  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() request: RawBodyRequest<Request>,
  ) {
    try {
      if (!signature) {
        console.error('[Stripe Webhook] Missing stripe-signature header');
        return { received: false, error: 'Missing stripe-signature header' };
      }

      const rawBody = request.rawBody;
      if (!rawBody) {
        console.error('[Stripe Webhook] Missing raw body');
        return { received: false, error: 'Missing raw body' };
      }

      const result = await this.stripeService.handleWebhookEvent(signature, rawBody);
      console.log('[Stripe Webhook] Successfully processed event');
      return result;
    } catch (error) {
      // Log o erro mas retorna 200 para evitar retry infinito
      console.error('[Stripe Webhook] Error processing webhook:', error);
      return { 
        received: false, 
        error: error.message || 'Unknown error processing webhook' 
      };
    }
  }
}

