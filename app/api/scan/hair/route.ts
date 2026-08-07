import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { recommendHair } from '@/lib/openai'
import { NextResponse } from 'next/server'

export const runtime = 'edge'
export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('subscription_tier, scans_used_this_month').eq('id', user.id).single()
    const isFree = profile?.subscription_tier === 'free'
    const scansUsed = profile?.scans_used_this_month || 0
    if (isFree && scansUsed >= 3) return NextResponse.json({ error: 'Free limit reached', upgrade: true }, { status: 403 })
    const formData = await request.formData()
    const image = formData.get('image') as File
    const budget = parseInt(formData.get('budget') as string)
    const preferences = formData.get('preferences')?.toString()
    if (!image || !budget) return NextResponse.json({ error: 'Image and budget required' }, { status: 400 })
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const filePath = `${user.id}/${Date.now()}-hair.jpg`
    await supabase.storage.from('scan-images').upload(filePath, buffer, { contentType: 'image/jpeg' })
    const { data: { publicUrl } } = supabase.storage.from('scan-images').getPublicUrl(filePath)
    const analysis = await recommendHair(base64, budget, preferences)
    await supabase.from('hair_scans').insert({ user_id: user.id, face_image_url: publicUrl, face_image_path: filePath, budget, face_shape: analysis.face_shape, recommended_styles: analysis.recommended_styles })
    if (isFree) await supabase.from('profiles').update({ scans_used_this_month: scansUsed + 1 }).eq('id', user.id)
    return NextResponse.json({ success: true, analysis })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Analysis failed' }, { status: 500 }) }
}
