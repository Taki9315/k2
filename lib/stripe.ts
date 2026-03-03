import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});

/**
 * Product definitions – used by checkout and webhooks.
 * price keys match Stripe Price IDs set via env vars.
 */
export const PRODUCTS = {
  kit: {
    name: 'K2 Success Kit',
    description:
      'Core document templates, 4 PrepCoach prompts, and foundational CRE financing guidance.',
    priceAmount: 1500, // $15.00 in cents
    role: 'borrower' as const,
    envPriceKey: 'STRIPE_PRICE_KIT',
  },
  certified: {
    name: 'K2 Certified Borrower',
    description:
      'Lifetime access to the full K2 platform - PrepCoach, Deal Room, Preferred Lender network, and $1,500 closing credit.',
    priceAmount: 25000, // $250.00 in cents
    role: 'certified' as const,
    envPriceKey: 'STRIPE_PRICE_CERTIFIED',
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;
