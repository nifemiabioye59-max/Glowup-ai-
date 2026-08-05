'use client'
import { createBrowserClient } from '@supabase/ssr'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { SupabaseClient } from '@supabase/supabase-js'

const Context = createContext<SupabaseClient | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  )
  const router = useRouter()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.refresh()
    })
    return () => subscription.unsubscribe()
  }, [supabase, router])

  return <Context.Provider value={supabase}>{children}</Context.Provider>
}

export const useSupabase = () => {
  const ctx = useContext(Context)
  if (!ctx) throw new Error('useSupabase must be used within Providers')
  return { supabase: ctx }
}
