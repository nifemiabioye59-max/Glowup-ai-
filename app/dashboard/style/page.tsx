'use client'
import { useState, useCallback } from 'react'
import { Camera, Loader2, Sparkles, X } from 'lucide-react'

export default function StyleScanPage() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!selected.type.startsWith('image/')) { setError('Please upload an image'); return }
    if (selected.size > 10 * 1024 * 1024) { setError('Image too large'); return }
    setError(''); setFile(selected); setResult(null)
    const reader = new FileReader()
    reader.onload = (e) => setImage(e.target?.result as string)
    reader.readAsDataURL(selected)
  }, [])

  const handleAnalyze = async () => {
    if (!file) return
    setAnalyzing(true); setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await fetch('/api/scan/outfit', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setError(data.upgrade ? 'Free limit reached. Upgrade to continue.' : data.error); return }
      setResult(data.analysis)
    } catch (err: any) { setError(err.message || 'Failed') }
    finally { setAnalyzing(false) }
  }

  const clear = () => { setImage(null); setFile(null); setResult(null); setError('') }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Outfit Stylist</h1><p className="mt-1 text-gray-600">Upload a photo and get personalized styling advice</p></div>
      {!image ? (
        <label className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-glow-200 bg-glow-50/50 p-12 hover:border-glow-400 hover:bg-glow-50 cursor-pointer transition-colors">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform"><Camera className="h-8 w-8 text-glow-500" /></div>
          <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        </label>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg">
          <img src={image} alt="Preview" className="w-full max-h-[500px] object-contain" />
          <button onClick={clear} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"><X className="h-4 w-4" /></button>
        </div>
      )}
      {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error} {error.includes('Upgrade') && <a href="/dashboard/subscription" className="font-semibold underline ml-1">Upgrade</a>}</div>}
      {image && !result && (
        <button onClick={handleAnalyze} disabled={analyzing} className="btn-primary w-full gap-2">
          {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="h-4 w-4" /> Analyze Outfit</>}
        </button>
      )}
      {result && (
        <div className="space-y-6">
          <div className="card border-glow-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"><Sparkles className="h-5 w-5 text-glow-500" /> Your Analysis</h2>
            <div className="space-y-6">
              <div><h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Styling Tips</h3><ul className="space-y-3">{result.styling_tips?.map((tip: string, i: number) => (<li key={i} className="flex items-start gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-glow-100 text-xs font-medium text-glow-700">{i+1}</span><span className="text-gray-700">{tip}</span></li>))}</ul></div>
              {result.occasion_suggestions?.length > 0 && <div><h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Perfect For</h3><div className="flex flex-wrap gap-2">{result.occasion_suggestions.map((occ: string, i: number) => <span key={i} className="rounded-full bg-lavender-50 px-4 py-1.5 text-sm font-medium text-lavender-700">{occ}</span>)}</div></div>}
              {result.similar_items?.length > 0 && <div><h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Shop Similar</h3><div className="grid sm:grid-cols-2 gap-3">{result.similar_items.map((item: any, i: number) => (<div key={i} className="rounded-xl border border-gray-100 p-4"><p className="font-medium text-gray-900 capitalize">{item.category}</p><p className="text-sm text-gray-600 mt-1">{item.description}</p><p className="text-sm font-semibold text-glow-600 mt-2">~₦{item.estimated_price_ngn?.toLocaleString()}</p></div>))}</div></div>}
            </div>
          </div>
          <button onClick={clear} className="btn-secondary w-full">Scan Another Outfit</button>
        </div>
      )}
    </div>
  )
}
