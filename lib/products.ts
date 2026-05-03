export const PRODUCTS = {
  kit: {
    name: 'K2 Success Kit',
    description:
      'Core document templates, 4 PrepCoach prompts, and foundational CRE financing guidance.',
    priceAmount: 3900,
    role: 'borrower' as const,
    envPriceKey: 'STRIPE_PRICE_KIT',
  },
  certified: {
    name: 'K2 Certified Borrower',
    description:
      'Lifetime access to the full K2 platform - PrepCoach, Deal Room, Preferred Lender network, and $1,000 closing credit.*',
    priceAmount: 25000,
    role: 'certified' as const,
    envPriceKey: 'STRIPE_PRICE_CERTIFIED',
  },
} as const;

export type ProductKey = keyof typeof PRODUCTS;

const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatUsd(amount: number): string {
  return usdFormatter.format(amount);
}

export function formatUsdFromCents(amountInCents: number): string {
  return formatUsd(amountInCents / 100);
}

export function getProductPriceLabel(product: ProductKey): string {
  return formatUsdFromCents(PRODUCTS[product].priceAmount);
}

export const KIT_PRICE_LABEL = getProductPriceLabel('kit');
export const CERTIFIED_PRICE_LABEL = getProductPriceLabel('certified');

export const CERTIFIED_CLOSING_CREDIT_AMOUNT = 1000;
export const CERTIFIED_CLOSING_CREDIT_LABEL = formatUsd(
  CERTIFIED_CLOSING_CREDIT_AMOUNT
);