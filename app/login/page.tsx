'use client'

import { useState } from 'react'
import { Sparkles, Mail, Lock, User } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [age, setAge] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', name || email)
    localStorage.setItem('userAge', age)
    localStorage.setItem('isLoggedIn', 'true')
    alert(isLogin ? 'Welcome back!' : 'Account created! Welcome to Glow Up AI.')
    window.location.href = '/dashboard'
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-4 border-pink-200">
          <img src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=200&h=200&fit=crop" alt="Glow Up" className="w-full h-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold text-pink-600 mb-1 flex items-center justify-center gap-2">
          <Sparkles size={24} /> Glow Up AI
        </h1>
        <p className="text-gray-500 text-sm">{isLogin ? 'Sign in to your account' : 'Create your account'}</p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-pink-100 shadow-sm">
        <div className="flex mb-6 bg-pink-50 rounded-xl p-1">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${isLogin ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${!isLogin ? 'bg-white text-pink-600 shadow-sm' : 'text-gray-500'}`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="number"
                  placeholder="Age (years)"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  required
                />
              </div>
            </>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="email"
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="password"
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full pink-gradient text-white py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            {isLogin ? 'Login' : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          By continuing, you agree to our Terms & Privacy Policy
        </p>
      </div>
    </main>
  )
    }
