import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';
import { PrismaService } from '../database/prisma.service';
import { stripeConfig, PlanType } from '../../config/stripe.config';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2023-10-16',
    });
  }

  /**
   * Criar sessão de checkout
   */
  async createCheckoutSession(
    clerkUserId: string,
    planType: PlanType,
    successUrl: string,
    cancelUrl: string,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const plan = stripeConfig.plans[planType];

      if (!plan.priceId) {
        throw new Error(`Price ID not configured for plan: ${planType}`);
      }

      // Criar ou recuperar customer do Stripe
      let customerId = user.stripeCustomerId;

      if (!customerId) {
        const customer = await this.stripe.customers.create({
          email: user.email,
          metadata: {
            userId: user.id,
            clerkId: user.clerkUserId,
          },
        });

        customerId = customer.id;

        // Atualizar user com stripeCustomerId
        await this.prisma.user.update({
          where: { id: user.id },
          data: { stripeCustomerId: customerId },
        });
      }

      // Criar checkout session
      const session = await this.stripe.checkout.sessions.create({
        customer: customerId,
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        metadata: {
          userId: user.id,
          clerkUserId,
          planType,
        },
      });

      this.logger.log(`Checkout session created: ${session.id} for user: ${clerkUserId}`);

      return {
        sessionId: session.id,
        url: session.url,
      };
    } catch (error) {
      this.logger.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Criar portal do cliente
   */
  async createCustomerPortal(clerkUserId: string, returnUrl: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user?.stripeCustomerId) {
        throw new Error('User does not have a Stripe customer ID');
      }

      const session = await this.stripe.billingPortal.sessions.create({
        customer: user.stripeCustomerId,
        return_url: returnUrl,
      });

      return {
        url: session.url,
      };
    } catch (error) {
      this.logger.error('Error creating customer portal:', error);
      throw error;
    }
  }

  /**
   * Cancelar assinatura
   */
  async cancelSubscription(clerkUserId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user?.stripeSubscriptionId) {
        throw new Error('User does not have an active subscription');
      }

      const subscription = await this.stripe.subscriptions.update(
        user.stripeSubscriptionId,
        {
          cancel_at_period_end: true,
        },
      );

      this.logger.log(`Subscription cancelled: ${subscription.id} for user: ${clerkUserId}`);

      return {
        subscriptionId: subscription.id,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        currentPeriodEnd: subscription.current_period_end,
      };
    } catch (error) {
      this.logger.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  /**
   * Reativar assinatura
   */
  async reactivateSubscription(clerkUserId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user?.stripeSubscriptionId) {
        throw new Error('User does not have a subscription');
      }

      const subscription = await this.stripe.subscriptions.update(
        user.stripeSubscriptionId,
        {
          cancel_at_period_end: false,
        },
      );

      this.logger.log(`Subscription reactivated: ${subscription.id} for user: ${clerkUserId}`);

      return {
        subscriptionId: subscription.id,
        status: subscription.status,
      };
    } catch (error) {
      this.logger.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  /**
   * Obter assinatura do usuário
   */
  async getUserSubscription(clerkUserId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { clerkUserId },
      });

      if (!user?.stripeSubscriptionId) {
        return null;
      }

      const subscription = await this.stripe.subscriptions.retrieve(
        user.stripeSubscriptionId,
      );

      return {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.current_period_start,
        currentPeriodEnd: subscription.current_period_end,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        plan: user.plan,
      };
    } catch (error) {
      this.logger.error('Error getting user subscription:', error);
      return null;
    }
  }

  /**
   * Processar evento de webhook do Stripe
   */
  async handleWebhookEvent(signature: string, payload: Buffer) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        stripeConfig.webhookSecret,
      );

      this.logger.log(`Processing webhook event: ${event.type}`);

      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
          break;

        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
          break;

        default:
          this.logger.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      this.logger.error('Error handling webhook event:', error);
      throw error;
    }
  }

  /**
   * Handler: Checkout session completed
   */
  private async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    const planType = session.metadata?.planType as PlanType;

    if (!userId || !planType) {
      this.logger.error('Missing metadata in checkout session');
      return;
    }

    const subscriptionId = session.subscription as string;

    // Atualizar usuário com subscription
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        plan: planType.toUpperCase() as any,
        stripeSubscriptionId: subscriptionId,
        subscriptionStatus: 'active',
      },
    });

    this.logger.log(`User ${userId} upgraded to ${planType}`);
  }

  /**
   * Handler: Subscription created
   */
  private async handleSubscriptionCreated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.error(`User not found for customer: ${customerId}`);
      return;
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        stripeSubscriptionId: subscription.id,
        subscriptionStatus: subscription.status,
      },
    });
  }

  /**
   * Handler: Subscription updated
   */
  private async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.error(`User not found for customer: ${customerId}`);
      return;
    }

    // Atualizar status
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: subscription.status,
      },
    });

    // Se subscription foi cancelada
    if (subscription.status === 'canceled') {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          plan: 'FREE',
          stripeSubscriptionId: null,
          subscriptionStatus: null,
        },
      });
    }
  }

  /**
   * Handler: Subscription deleted
   */
  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const customerId = subscription.customer as string;

    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.error(`User not found for customer: ${customerId}`);
      return;
    }

    // Downgrade para FREE
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        plan: 'FREE',
        stripeSubscriptionId: null,
        subscriptionStatus: null,
      },
    });

    this.logger.log(`User ${user.id} downgraded to FREE`);
  }

  /**
   * Handler: Invoice payment succeeded
   */
  private async handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.error(`User not found for customer: ${customerId}`);
      return;
    }

    this.logger.log(`Payment succeeded for user: ${user.id}`);

    // Resetar contador de análises se necessário
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'active',
      },
    });
  }

  /**
   * Handler: Invoice payment failed
   */
  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const customerId = invoice.customer as string;

    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId: customerId },
    });

    if (!user) {
      this.logger.error(`User not found for customer: ${customerId}`);
      return;
    }

    this.logger.warn(`Payment failed for user: ${user.id}`);

    // Atualizar status
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        subscriptionStatus: 'past_due',
      },
    });
  }
}

