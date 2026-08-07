'use client'

import './globals.css'
import { Inter } from 'next/font/google'
import { useEffect } from 'react'
import Navbar from '@/components/Navbar'
import AdminPanel from '@/components/AdminPanel'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'l' || e.key === 'L') {
        const panel = document.getElementById('admin-panel')
        if (panel) {
          panel.style.display = panel.style.display === 'none' ? 'flex' : 'none'
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <AdminPanel />
        {children}
      </body>
    </html>
  )
}

