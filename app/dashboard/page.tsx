import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Camera, Heart, Shirt, ShoppingBag, Calendar, Dumbbell, ArrowRight } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('subscription_tier, scans_used_this_month').eq('id', user.id).single()

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p className="mt-1 text-gray-600">Ready to glow up today?</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { name: 'Style Scan', desc: 'Analyze your outfit', icon: Camera, href: '/dashboard/style', color: 'from-glow-400 to-glow-600' },
          { name: 'Skin Check', desc: 'Analyze your skin', icon: Heart, href: '/dashboard/skin', color: 'from-lavender-400 to-lavender-600' },
          { name: 'Hair Advisor', desc: 'Find your style', icon: Shirt, href: '/dashboard/hair', color: 'from-rose-400 to-rose-600' },
          { name: 'Food Scanner', desc: 'Track your meals', icon: ShoppingBag, href: '/dashboard/food', color: 'from-amber-400 to-amber-600' },
          { name: 'Period Tracker', desc: 'Track your cycle', icon: Calendar, href: '/dashboard/tracker', color: 'from-pink-400 to-pink-600' },
          { name: 'Fitness', desc: 'Workout plans', icon: Dumbbell, href: '/dashboard/fitness', color: 'from-emerald-400 to-emerald-600' },
        ].map((action) => (
          <Link key={action.name} href={action.href} className="group relative overflow-hidden rounded-3xl p-6 text-white shadow-lg transition-transform hover:scale-[1.02]">
            <div className={`absolute inset-0 bg-gradient-to-br ${action.color}`} />
            <div className="relative">
              <action.icon className="h-8 w-8 mb-4 opacity-90" />
              <h3 className="text-lg font-semibold">{action.name}</h3>
              <p className="mt-1 text-sm opacity-90">{action.desc}</p>
              <ArrowRight className="mt-4 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        ))}
      </div>
      {profile?.subscription_tier === 'free' && (
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Monthly Scans</h2>
            <span className="text-sm text-glow-600 font-medium">{profile.scans_used_this_month || 0}/3 used</span>
          </div>
          <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-glow-400 to-lavender-400 transition-all" style={{ width: `${Math.min(((profile.scans_used_this_month || 0) / 3) * 100, 100)}%` }} />
          </div>
          <p className="mt-3 text-xs text-gray-500">Upgrade to Pro for unlimited scans</p>
        </div>
      )}
    </div>
  )
}
