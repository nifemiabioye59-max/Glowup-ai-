'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSupabase } from './providers'
import { useRouter } from 'next/navigation'
import { Sparkles, Camera, Heart, Shirt, ShoppingBag, Calendar, Dumbbell, Crown, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { name: 'Style', href: '/dashboard/style', icon: Camera },
  { name: 'Skin', href: '/dashboard/skin', icon: Heart },
  { name: 'Hair', href: '/dashboard/hair', icon: Shirt },
  { name: 'Food', href: '/dashboard/food', icon: ShoppingBag },
  { name: 'Shop', href: '/dashboard/shop', icon: ShoppingBag },
  { name: 'Tracker', href: '/dashboard/tracker', icon: Calendar },
  { name: 'Fitness', href: '/dashboard/fitness', icon: Dumbbell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
]

export function DashboardNav({ user }: { user: any }) {
  const pathname = usePathname()
  const { supabase } = useSupabase()
  const router = useRouter()
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
      <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-glow-100 bg-white px-6 pb-4">
        <div className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-glow-400 to-lavender-500"><Sparkles className="h-4 w-4 text-white" /></div>
          <span className="font-bold text-gray-900">GLOWUP<span className="text-glow-500">.AI</span></span>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-glow-500 to-lavender-500 p-4 text-white">
          <div className="flex items-center gap-2 mb-2"><Crown className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">{user?.subscription_tier || 'Free'}</span></div>
          <p className="text-sm opacity-90">{user?.subscription_tier === 'free' ? '3 scans/month' : 'Unlimited'}</p>
        </div>
        <nav className="flex flex-1 flex-col gap-y-1">
          {nav.map((item) => (
            <Link key={item.name} href={item.href} className={cn('group flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors', pathname === item.href ? 'bg-glow-50 text-glow-700' : 'text-gray-600 hover:bg-gray-50')}>
              <item.icon className={cn('h-5 w-5 shrink-0', pathname === item.href ? 'text-glow-500' : 'text-gray-400')} />
              {item.name}
            </Link>
          ))}
        </nav>
        <button onClick={async () => { await supabase.auth.signOut(); router.push('/') }} className="flex items-center gap-x-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"><LogOut className="h-5 w-5 text-gray-400" /> Sign out</button>
      </div>
    </div>
  )
}
