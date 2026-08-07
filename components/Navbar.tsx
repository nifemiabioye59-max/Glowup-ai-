'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Sparkles } from 'lucide-react'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '/', label: 'Home' },
    { href: '/fitness', label: 'Fitness' },
    { href: '/food', label: 'Food' },
    { href: '/hair', label: 'Hair' },
    { href: '/period', label: 'Period' },
    { href: '/marketplace', label: 'Market' },
    { href: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <nav className="sticky top-0 z-50 glass border-b border-pink-100">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-pink-600 font-bold text-xl">
          <Sparkles size={24} />
          Glow Up AI
        </Link>
        <button onClick={() => setOpen(!open)} className="md:hidden text-pink-600">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className={`${open ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:static top-14 left-0 right-0 bg-white md:bg-transparent p-4 md:p-0 gap-4 md:gap-6 border-b md:border-0 border-pink-100`}>
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-gray-700 hover:text-pink-600 font-medium transition" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
