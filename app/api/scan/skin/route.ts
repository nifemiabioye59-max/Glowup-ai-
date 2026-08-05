import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { analyzeSkin } from '@/lib/openai'
import { NextResponse } from 'next/server'

export const maxDuration = 30

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { data: profile } = await supabase.from('profiles').select('subscription_tier, scans_used_this_month').eq('id', user.id).single()
    const isFree = profile?.subscription_tier === 'free'
    const scansUsed = profile?.scans_used_this_month || 0
    if (isFree && scansUsed >= 3) return NextResponse.json({ error: 'Free limit reached', upgrade: true }, { status: 403 })
    const formData = await request.formData()
    const image = formData.get('image') as File
    const concerns = formData.get('concerns')?.toString().split(',').filter(Boolean)
    if (!image) return NextResponse.json({ error: 'No image' }, { status: 400 })
    const bytes = await image.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const filePath = `${user.id}/${Date.now()}-skin.jpg`
    await supabase.storage.from('scan-images').upload(filePath, buffer, { contentType: 'image/jpeg' })
    const { data: { publicUrl } } = supabase.storage.from('scan-images').getPublicUrl(filePath)
    const analysis = await analyzeSkin(base64, concerns)
    await supabase.from('skin_scans').insert({ user_id: user.id, image_url: publicUrl, image_path: filePath, skin_type: analysis.skin_type, skin_concerns: analysis.concerns || [], recommendations: analysis.recommendations, recommended_products: analysis.product_suggestions || [] })
    if (isFree) await supabase.from('profiles').update({ scans_used_this_month: scansUsed + 1 }).eq('id', user.id)
    return NextResponse.json({ success: true, analysis })
  } catch (error) { console.error(error); return NextResponse.json({ error: 'Analysis failed' }, { status: 500 }) }
}
