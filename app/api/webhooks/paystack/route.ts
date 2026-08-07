import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get('x-paystack-signature')
    if (!signature) return NextResponse.json({ error: 'No signature' }, { status: 400 })
    const hash = crypto.createHmac('sha512', process.env.PAYSTACK_SECRET_KEY!).update(body).digest('hex')
    if (hash !== signature) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    const event = JSON.parse(body)
    if (event.event === 'charge.success') { /* Handle if needed */ }
    return NextResponse.json({ received: true })
  } catch (error) { return NextResponse.json({ error: 'Webhook failed' }, { status: 500 }) }
}
