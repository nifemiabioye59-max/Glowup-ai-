'use client'

import { useState } from 'react'
import { Lock, X, Users, ShoppingBag, TrendingUp } from 'lucide-react'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '@/lib/utils'

export default function AdminPanel() {
  const [show, setShow] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)
  const [tab, setTab] = useState('users')

  const login = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setLoggedIn(true)
    } else {
      alert('Wrong email or password')
    }
  }

  if (!show) return (
    <button
      onClick={() => setShow(true)}
      className="fixed top-20 left-2 z-40 w-8 h-8 opacity-0 hover:opacity-100 transition-opacity"
      title="Admin"
    >
      <div className="w-2 h-2 bg-pink-500 rounded-full" />
    </button>
  )

  return (
    <div id="admin-panel" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-2xl font-bold text-pink-600 flex items-center gap-2">
            <Lock size={24} /> Admin Dashboard
          </h2>
          <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {!loggedIn ? (
          <div className="p-8 space-y-4 max-w-md mx-auto">
            <p className="text-gray-600 text-center">Enter admin credentials</p>
            <input
              type="email"
              placeholder="Admin email"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Secret code"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              onClick={login}
              className="w-full pink-gradient text-white py-3 rounded-xl font-semibold hover:opacity-90"
            >
              Enter Dashboard
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex gap-4 mb-6 border-b pb-4">
              {[
                { id: 'users', icon: Users, label: 'Users' },
                { id: 'products', icon: ShoppingBag, label: 'Products' },
                { id: 'stats', icon: TrendingUp, label: 'Stats' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                    tab === t.id ? 'bg-pink-100 text-pink-600' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <t.icon size={18} /> {t.label}
                </button>
              ))}
            </div>

            {tab === 'users' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Registered Users</h3>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-500 text-center">
                  Connect to Supabase to see users here
                </div>
              </div>
            )}
            {tab === 'products' && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">Pending Product Approvals</h3>
                <div className="bg-gray-50 rounded-xl p-4 text-gray-500 text-center">
                  Products waiting for approval will appear here
                </div>
              </div>
            )}
            {tab === 'stats' && (
              <div className="grid grid-cols-3 gap-4">
                {['Total Users', 'Active Subscriptions', 'Products Sold'].map(s => (
                  <div key={s} className="bg-pink-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold text-pink-600">0</p>
                    <p className="text-sm text-gray-600">{s}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
