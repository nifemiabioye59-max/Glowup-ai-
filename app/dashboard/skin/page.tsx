'use client'
import { useState, useCallback } from 'react'
import { Camera, Loader2, Sparkles, X, Heart } from 'lucide-react'

const CONCERNS = ['Acne', 'Dark spots', 'Dryness', 'Oiliness', 'Aging', 'Sensitivity', 'Uneven tone', 'Large pores']

export default function SkinScanPage() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [concerns, setConcerns] = useState<string[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/')) { setError('Upload an image'); return }
    if (selected.size > 10 * 1024 * 1024) { setError('Too large'); return }
    setError(''); setFile(selected); setResult(null)
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target?.result as string)
    reader.readAsDataURL(selected)
  }, [])

  const toggle = (c: string) => setConcerns(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c])

  const handleAnalyze = async () => {
    if (!file) return
    setAnalyzing(true); setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      if (concerns.length) formData.append('concerns', concerns.join(','))
      const res = await fetch('/api/scan/skin', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setError(data.upgrade ? 'Free limit reached. Upgrade to continue.' : data.error); return }
      setResult(data.analysis)
    } catch (err: any) { setError(err.message || 'Failed') }
    finally { setAnalyzing(false) }
  }

  const clear = () => { setImage(null); setFile(null); setResult(null); setConcerns([]); setError('') }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Skin Analysis</h1><p className="mt-1 text-gray-600">Get to know your skin and build the perfect routine</p></div>
      {!image ? (
        <div className="space-y-6">
          <label className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-lavender-200 bg-lavender-50/50 p-12 hover:border-lavender-400 hover:bg-lavender-50 cursor-pointer transition-colors">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform"><Camera className="h-8 w-8 text-lavender-500" /></div>
            <p className="text-sm font-medium text-gray-900">Upload a clear face photo</p>
            <p className="mt-1 text-xs text-gray-500">Good lighting works best</p>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Any concerns? (optional)</p>
            <div className="flex flex-wrap gap-2">
              {CONCERNS.map(c => <button key={c} onClick={() => toggle(c)} className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${concerns.includes(c) ? 'bg-lavender-500 text-white' : 'bg-white text-gray-600 hover:bg-lavender-50 ring-1 ring-gray-200'}`}>{c}</button>)}
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg">
          <img src={image} alt="Preview" className="w-full max-h-[500px] object-contain" />
          <button onClick={clear} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"><X className="h-4 w-4" /></button>
        </div>
      )}
      {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error} {error.includes('Upgrade') && <a href="/dashboard/subscription" className="font-semibold underline ml-1">Upgrade</a>}</div>}
      {image && !result && (
        <button onClick={handleAnalyze} disabled={analyzing} className="w-full rounded-xl bg-lavender-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-lavender-600 disabled:opacity-50 flex items-center justify-center gap-2">
          {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="h-4 w-4" /> Analyze Skin</>}
        </button>
      )}
      {result && (
        <div className="space-y-6">
          <div className="card border-lavender-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"><Heart className="h-5 w-5 text-lavender-500" /> Your Skin Profile</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-2xl bg-lavender-50 p-6"><p className="text-sm text-lavender-600 font-medium uppercase tracking-wider">Skin Type</p><p className="text-2xl font-bold text-gray-900 mt-1 capitalize">{result.skin_type}</p></div>
              <div className="rounded-2xl bg-glow-50 p-6"><p className="text-sm text-glow-600 font-medium uppercase tracking-wider">Tone Match</p><p className="text-lg font-semibold text-gray-900 mt-1">{result.skin_tone}</p></div>
            </div>
            {result.recommendations?.morning_routine && <div className="mb-6"><h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Morning Routine</h3><ol className="space-y-2">{result.recommendations.morning_routine.map((step: string, i: number) => <li key={i} className="flex items-start gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-medium text-amber-700">{i+1}</span><span className="text-gray-700">{step}</span></li>)}</ol></div>}
            {result.recommendations?.evening_routine && <div className="mb-6"><h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Evening Routine</h3><ol className="space-y-2">{result.recommendations.evening_routine.map((step: string, i: number) => <li key={i} className="flex items-start gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-medium text-indigo-700">{i+1}</span><span className="text-gray-700">{step}</span></li>)}</ol></div>}
            {result.product_suggestions?.length > 0 && <div className="pt-6 border-t border-gray-100"><h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Suggested Products</h3><div className="space-y-3">{result.product_suggestions.map((p: any, i: number) => <div key={i} className="flex items-center justify-between rounded-xl border border-gray-100 p-4"><div><p className="font-medium text-gray-900 capitalize">{p.category}</p><p className="text-sm text-gray-600">{p.type}</p></div><span className="text-sm font-semibold text-glow-600">~₦{p.estimated_price_ngn?.toLocaleString()}</span></div>)}</div></div>}
          </div>
          <button onClick={clear} className="btn-secondary w-full">Analyze Another</button>
        </div>
      )}
    </div>
  )
}
