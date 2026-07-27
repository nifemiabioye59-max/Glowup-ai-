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
    if (!profile
