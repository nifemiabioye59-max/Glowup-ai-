'use client'
import { useState } from 'react'
import { useSupabase } from './providers'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2 } from 'lucide-react'

export function LoginForm() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName }, emailRedirectTo: `${window.location.origin}/auth/callback` } })
        if (error) throw error
        setError('Check your email to confirm!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
        router.refresh()
      }
    } catch (err: any) { setError(err.message || 'Something went wrong') }
    finally { setLoading(false) }
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        {isSignUp && <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><input name="fullName" type="text" required={isSignUp} className="input-glow" placeholder="Your name" /></div>}
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label><input name="email" type="email" required className="input-glow" placeholder="you@example.com" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label><div className="relative"><input name="password" type={showPassword ? 'text' : 'password'} required minLength={6} className="input-glow pr-10" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
        {error && <div className={`rounded-xl p-3 text-sm ${error.includes('Check your email') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{error}</div>}
        <button type="submit" disabled={loading} className="btn-primary w-full gap-2">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isSignUp ? 'Create Account' : 'Sign In'}</button>
      </form>
      <div className="mt-6 text-center"><button onClick={() => { setIsSignUp(!isSignUp); setError('') }} className="text-sm text-glow-600 font-medium">{isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}</button></div>
    </div>
  )
}
