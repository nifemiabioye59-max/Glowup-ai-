'use client'
import { useState } from 'react'
import { useSupabase } from './providers'
import { useRouter } from 'next/navigation'
import { Loader2, Save } from 'lucide-react'

export function SettingsForm({ profile }: { profile: any }) {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    const formData = new FormData(e.currentTarget)
    const updates = {
      full_name: formData.get('fullName') as string,
      age: parseInt(formData.get('age') as string) || null,
      gender: formData.get('gender') as string,
      goals: (formData.get('goals') as string).split(',').map(g => g.trim()).filter(Boolean),
    }
    const { error } = await supabase.from('profiles').update(updates).eq('id', profile.id)
    setSaving(false)
    if (error) setMessage('Failed to update')
    else { setMessage('Profile updated!'); router.refresh() }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 card">
      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label><input name="fullName" type="text" defaultValue={profile?.full_name || ''} className="input-glow" /></div>
      <div className="grid sm:grid-cols-2 gap-6">
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Age</label><input name="age" type="number" min={13} max={100} defaultValue={profile?.age || ''} className="input-glow" /></div>
        <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label><select name="gender" defaultValue={profile?.gender || ''} className="input-glow"><option value="">Select</option><option value="female">Female</option><option value="male">Male</option><option value="non-binary">Non-binary</option><option value="prefer-not-say">Prefer not to say</option></select></div>
      </div>
      <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Beauty Goals (comma separated)</label><textarea name="goals" defaultValue={profile?.goals?.join(', ') || ''} placeholder="e.g., clear skin, healthy hair" className="input-glow min-h-[80px] resize-none" /></div>
      {message && <div className={`rounded-xl p-3 text-sm ${message.includes('updated') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>{message}</div>}
      <button type="submit" disabled={saving} className="btn-primary gap-2">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save Changes</button>
    </form>
  )
}
