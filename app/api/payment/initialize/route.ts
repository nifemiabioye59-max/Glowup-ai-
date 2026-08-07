import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { initializePayment, PLANS } from '@/lib/paystack'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { plan } = await request.json()
    if (!PLANS[plan as keyof typeof PLANS]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()
    if (!import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { initializePayment, PLANS } from '@/lib/paystack'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { plan } = await request.json()
    if (!PLANS[plan as keyof typeof PLANS]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    const { data: profile } = await supabase.from('profiles').select('email').eq('id', user.id).single()
    if (!profile?.email) return NextResponse.json({ error: 'Email required' }, { status: 400 })
    const reference = `GLOW-${plan}-${Date.now()}-${user.id.slice(0, 8)}`
    const payment = await initializePayment({ email: profile.email, amount: PLANS[plan as keyof typeof PLANS].amount, reference, metadata: { user_id: user.id, plan } })
    if (!payment.status) throw new Error(payment.message || 'Failed')
    return NextResponse.json({ success: true, authorization_url: payment.data?.authorization_url, reference })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Payment failed' }, { status: 500 }) }
}
