// Cliente Stripe para o frontend
import { API_BASE_URL } from './api';

/**
 * Criar sessão de checkout
 */
export async function createCheckoutSession(
  planType: 'pro',
  token: string,
) {
  const response = await fetch(`${API_BASE_URL}/stripe/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      planType,
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/pricing?canceled=true`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create checkout session');
  }

  return response.json();
}

/**
 * Criar portal do cliente
 */
export async function createCustomerPortal(token: string) {
  const response = await fetch(`${API_BASE_URL}/stripe/create-customer-portal`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      returnUrl: `${window.location.origin}/dashboard`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create customer portal');
  }

  return response.json();
}

/**
 * Cancelar assinatura
 */
export async function cancelSubscription(token: string) {
  const response = await fetch(`${API_BASE_URL}/stripe/cancel-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to cancel subscription');
  }

  return response.json();
}

/**
 * Reativar assinatura
 */
export async function reactivateSubscription(token: string) {
  const response = await fetch(`${API_BASE_URL}/stripe/reactivate-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to reactivate subscription');
  }

  return response.json();
}

/**
 * Obter assinatura do usuário
 */
export async function getUserSubscription(token: string) {
  const response = await fetch(`${API_BASE_URL}/stripe/subscription`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get subscription');
  }

  return response.json();
}

