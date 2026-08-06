import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { Camera, Heart, Shirt, ShoppingBag, Calendar, Dumbbell } from 'lucide-react'

const actions = [
  { name: 'Style Scan', desc: 'Analyze your outfit', icon: Camera, href: '/dashboard/style', color: 'from-glow-400 to-glow-600' },
  { name: 'Skin Check', desc: 'Analyze your skin', icon: Heart, href: '/dashboard/skin', color: 'from-lavender-400 to-lavender-600' },
  { name: 'Hair Advisor', desc: 'Find your style', icon: Shirt, href: '/dashboard/hair', color: 'from-rose-400 to-rose-600' },
  { name: 'Food Scanner', desc: 'Track your meals', icon: ShoppingBag, href: '/dashboard/food', color: 'from-amber-400 to-amber-600' },
  { name: 'Period Tracker', desc: 'Track your cycle', icon: Calendar, href: '/dashboard/tracker', color: 'from-pink-400 to-pink-600' },
  { name: 'Fitness', desc: 'Workout plans', icon: Dumbbell, href: '/dashboard/fitness', color: 'from-emerald-400 to-emerald-600' },
]

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_tier, scans_used_this_month')
    .eq('id', user!.id)
    .single()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">What would you like to do today?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group relative overflow-hidden rounded-3xl bg-white p-6 shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:-translate-y-1"
          >
            <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${action.color} text-white mb-4`}>
              <action.icon className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{action.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{action.desc}</p>
          </Link>
        ))}
      </div>

      {profile?.subscription_tier === 'free' && (
        <div className="rounded-3xl bg-gradient-to-br from-glow-500 to-lavender-500 p-6 text-white">
          <h3 className="text-lg font-semibold">Monthly Scans</h3>
          <p className="mt-2 text-3xl font-bold">{profile.scans_used_this_month || 0}/3 used</p>
          <p className="mt-1 text-sm opacity-90">Upgrade to Pro for unlimited scans</p>
        </div>
      )}
    </div>
  )
}
