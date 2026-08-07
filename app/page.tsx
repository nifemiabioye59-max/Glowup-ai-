'use client'

import Link from 'next/link'
import { Sparkles, Dumbbell, Utensils, Scissors, Heart, ShoppingBag, Crown, Lock } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [scansUsed, setScansUsed] = useState(0)
  const [fitnessDays, setFitnessDays] = useState(0)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    setScansUsed(Number(localStorage.getItem('scansUsed') || '0'))
    setFitnessDays(Number(localStorage.getItem('fitnessDays') || '0'))
    setSubscribed(localStorage.getItem('subscribed') === 'true')
  }, [])

  const features = [
    { icon: Dumbbell, title: 'Fitness Plan', desc: '3-month guided workout with pictures, rest timers & weight tracking', href: '/fitness', color: 'bg-orange-100 text-orange-600' },
    { icon: Utensils, title: 'Food & Recipes', desc: 'Country-based recipes with pictures, ingredients & health filters', href: '/food', color: 'bg-green-100 text-green-600' },
    { icon: Scissors, title: 'Hair Styles', desc: 'Browse Pinterest-style hairstyles, scan your face & get AI matches', href: '/hair', color: 'bg-purple-100 text-purple-600' },
    { icon: Heart, title: 'Period Tracker', desc: 'Track cycle, get reminders, pain logs & health insights', href: '/period', color: 'bg-red-100 text-red-600' },
    { icon: ShoppingBag, title: 'Marketplace', desc: 'Buy beauty & body enhancement products. Sell your own too!', href: '/marketplace', color: 'bg-blue-100 text-blue-600' },
    { icon: Crown, title: 'AI Analysis', desc: 'Get personalized beauty, fitness & health recommendations', href: '/dashboard', color: 'bg-pink-100 text-pink-600' },
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center py-12">
        <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-pink-200">
          <img src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=300&fit=crop" alt="Glow Up" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-4 flex items-center justify-center gap-3">
          Glow Up AI <Sparkles className="text-yellow-400" size={36} />
        </h1>
        <p className="text-gray-600 text-lg max-w-xl mx-auto mb-8">
          Your personal beauty, fitness & wellness companion with AI-powered recommendations
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/login" className="pink-gradient text-white px-8 py-3 rounded-full font-semibold hover:opacity-90 transition">
            Login
          </Link>
          <Link href="/login" className="bg-white text-pink-600 border-2 border-pink-200 px-8 py-3 rounded-full font-semibold hover:bg-pink-50 transition">
            Sign Up
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm border border-pink-100">
        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Lock size={18} /> Your Free Usage
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-pink-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-pink-600">{3 - scansUsed}</p>
            <p className="text-sm text-gray-600">Free AI Scans Left</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{3 - fitnessDays}</p>
            <p className="text-sm text-gray-600">Free Fitness Days Left</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{subscribed ? 'Active' : 'Inactive'}</p>
            <p className="text-sm text-gray-600">Premium Status</p>
          </div>
        </div>
        {!subscribed && (scansUsed >= 3 || fitnessDays >= 3) && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 font-semibold">You've used your free trials! Subscribe to Premium to continue.</p>
            <button className="mt-2 pink-gradient text-white px-6 py-2 rounded-full text-sm font-semibold">
              Upgrade to Premium
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Link key={i} href={f.href} className="card-hover bg-white rounded-2xl p-6 border border-pink-100">
            <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
              <f.icon size={24} />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">{f.title}</h3>
            <p className="text-gray-600 text-sm">{f.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-xs text-gray-300">Press L for admin access</p>
      </div>
    </main>
  )
}

          
