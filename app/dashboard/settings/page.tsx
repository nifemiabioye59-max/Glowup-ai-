import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SettingsForm } from '@/components/settings-form'

export default async function SettingsPage() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Settings</h1><p className="mt-1 text-gray-600">Manage your profile and preferences</p></div>
      <SettingsForm profile={profile} />
    </div>
  )
}
