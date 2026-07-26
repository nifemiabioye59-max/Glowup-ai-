import { Paystack } from 'paystack-sdk'
export const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!)

export const PLANS = {
  basic: { name: 'GLOW Basic', amount: 990000 },
  pro: { name: 'GLOW Pro', amount: 1800000 },
  elite: { name: 'GLOW Elite', amount: 3500000 },
} as const

export type PlanKey = keyof typeof PLANS

export async function initializePayment(params: { email: string; amount: number; reference: string; metadata?: Record<string, any> }) {
  return paystack.transaction.initialize({
    email: params.email, amount: params.amount.toString(), reference: params.reference,
    metadata: params.metadata, callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/subscription/verify`,
  })
}

export async function verifyPayment(reference: string) {
  return paystack.transaction.verify(reference) }
