
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { verifyPayment } from '@/lib/paystack'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference')
    if (!reference) return NextResponse.json({ error: 'Reference required' }, { status: 400 })
    const supabase = createRouteHandlerClient({ cookies })
    const verification = await verifyPayment(reference)
    if (!verification.status || verification.data?.status !== 'success') return NextResponse.json({ error: 'Verification failed' }, { status: 400 })
    const tx = verification.data
    const metadata = tx.metadata || {}
    const userId = metadata.user_id
    const plan = metadata.plan
    if (!userId || !plan) return NextResponse.json({ error: 'Invalid metadata' }, { status: 400 })
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 30)
    await supabase.from('subscriptions').insert({ user_id: userId, plan, amount: tx.amount, paystack_reference: reference, expires_at: expiresAt.toISOString() })
    await supabase.from('profiles').update({ subscription_tier: plan, subscription_expires_at: expiresAt.toISOString() }).eq('id', userId)
    return NextResponse.json({ success: true, plan, expires_at: expiresAt.toISOString() })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Verification failed' }, { status: 500 }) }
}
