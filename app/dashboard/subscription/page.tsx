'use client'
import { useState } from 'react'
import { Crown, Check, Loader2, Star } from 'lucide-react'

const PLANS = [
  { key: 'basic', name: 'GLOW Basic', price: '₦9,900', features: ['Unlimited style scans', 'Skin & hair analysis', 'Food scanner', 'Basic shop access'], color: 'from-glow-400 to-glow-600', popular: false },
  { key: 'pro', name: 'GLOW Pro', price: '₦18,000', features: ['Everything in Basic', 'Period tracker', 'Workout plans', '10% shop discount', 'Priority support'], color: 'from-lavender-400 to-lavender-600', popular: true },
  { key: 'elite', name: 'GLOW Elite', price: '₦35,000', features: ['Everything in Pro', 'Monthly video call', 'Personal shopper', 'VIP product drops', 'Priority delivery'], color: 'from-rose-400 to-rose-600', popular: false },
]

export default function SubscriptionPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (plan: string) => {
    setLoading(plan)
    try {
      const res = await fetch('/api/payment/initialize', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      window.location.href = data.authorization_url
    } catch (e) { console.error(e); setLoading(null) }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">Upgrade Your Glow</h1>
        <p className="mt-2 text-gray-600">Choose the plan that fits your glow-up goals</p>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map(plan => (
          <div key={plan.key} className={`relative rounded-3xl p-6 ${plan.popular ? 'bg-gray-900 text-white shadow-2xl scale-105' : 'bg-white text-gray-900 shadow-lg'}`}>
            {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-glow-500 px-4 py-1 text-xs font-semibold text-white">Most Popular</div>}
            <div className="mb-6">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${plan.color} mb-4`}><Crown className="h-5 w-5 text-white" /></div>
              <h3 className="text-lg font-semibold">{plan.name}</h3>
            </div>
            <div className="mb-6"><span className="text-3xl font-bold">{plan.price}</span><span className="text-sm opacity-70">/month</span></div>
            <ul className="space-y-3 mb-8">
              {plan.features.map(f => <li key={f} className="flex items-start gap-3"><Check className={`h-5 w-5 shrink-0 ${plan.popular ? 'text-glow-400' : 'text-glow-500'}`} /><span className="text-sm">{f}</span></li>)}
            </ul>
            <button onClick={() => handleSubscribe(plan.key)} disabled={loading === plan.key} className={`w-full rounded-xl py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${plan.popular ? 'bg-glow-500 text-white hover:bg-glow-400' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
              {loading === plan.key ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Star className="h-4 w-4" /> Subscribe</>}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
