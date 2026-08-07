'use client'
import { useState, useCallback } from 'react'
import { Camera, Loader2, Sparkles, X, Shirt } from 'lucide-react'

const BUDGETS = [{ label: 'Under ₦5k', value: 5000 }, { label: '₦5k-₦15k', value: 15000 }, { label: '₦15k-₦30k', value: 30000 }, { label: '₦30k-₦50k', value: 50000 }, { label: '₦50k+', value: 75000 }]

export default function HairScanPage() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [budget, setBudget] = useState(15000)
  const [preferences, setPreferences] = useState('')
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

  const handleAnalyze = async () => {
    if (!file) return
    setAnalyzing(true); setError('')
    try {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('budget', budget.toString())
      if (preferences) formData.append('preferences', preferences)
      const res = await fetch('/api/scan/hair', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setError(data.upgrade ? 'Free limit reached. Upgrade to continue.' : data.error); return }
      setResult(data.analysis)
    } catch (err: any) { setError(err.message || 'Failed') }
    finally { setAnalyzing(false) }
  }

  const clear = () => { setImage(null); setFile(null); setResult(null); setPreferences(''); setError('') }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Hair Advisor</h1><p className="mt-1 text-gray-600">Find styles that flatter your face shape and fit your budget</p></div>
      {!image ? (
        <div className="space-y-6">
          <label className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-rose-200 bg-rose-50/50 p-12 hover:border-rose-400 hover:bg-rose-50 cursor-pointer transition-colors">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform"><Camera className="h-8 w-8 text-rose-500" /></div>
            <p className="text-sm font-medium text-gray-900">Upload a clear face photo</p>
            <p className="mt-1 text-xs text-gray-500">Pull hair back to show face shape</p>
            <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
          </label>
          <div><label className="block text-sm font-medium text-gray-700 mb-3">What's your budget?</label><div className="grid grid-cols-2 sm:grid-cols-3 gap-2">{BUDGETS.map(b => <button key={b.value} onClick={() => setBudget(b.value)} className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${budget === b.value ? 'bg-rose-500 text-white' : 'bg-white text-gray-600 hover:bg-rose-50 ring-1 ring-gray-200'}`}>{b.label}</button>)}</div></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-2">Any preferences? (optional)</label><textarea value={preferences} onChange={e => setPreferences(e.target.value)} placeholder="e.g., protective styles, low maintenance, braids, wigs..." className="input-glow min-h-[80px] resize-none" /></div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden bg-white shadow-lg">
          <img src={image} alt="Preview" className="w-full max-h-[500px] object-contain" />
          <button onClick={clear} className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"><X className="h-4 w-4" /></button>
        </div>
      )}
      {error && <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">{error} {error.includes('Upgrade') && <a href="/dashboard/subscription" className="font-semibold underline ml-1">Upgrade</a>}</div>}
      {image && !result && (
        <button onClick={handleAnalyze} disabled={analyzing} className="w-full rounded-xl bg-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2">
          {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="h-4 w-4" /> Get Recommendations</>}
        </button>
      )}
      {result && (
        <div className="space-y-6">
          <div className="card border-rose-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"><Shirt className="h-5 w-5 text-rose-500" /> Your Hair Profile</h2>
            <div className="rounded-2xl bg-gradient-to-br from-rose-50 to-amber-50 p-6 mb-8">
              <p className="text-sm text-rose-600 font-medium uppercase tracking-wider">Face Shape</p>
              <p className="text-2xl font-bold text-gray-900 mt-1 capitalize">{result.face_shape}</p>
              <p className="text-gray-600 mt-2">{result.face_shape_description}</p>
            </div>
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Recommended Styles</h3>
              {result.recommended_styles?.map((style: any, i: number) => (
                <div key={i} className="rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">{style.style_name}</h4>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${style.maintenance_level === 'low' ? 'bg-green-100 text-green-700' : style.maintenance_level === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{style.maintenance_level} maintenance</span>
                  </div>
                  <p className="text-gray-600 mb-3">{style.description}</p>
                  <div className="rounded-xl bg-gray-50 p-4 mb-4"><p className="text-sm font-medium text-gray-900 mb-1">Why it works</p><p className="text-sm text-gray-600">{style.why_it_works}</p></div>
                  <div className="flex flex-wrap items-center gap-4 text-sm"><span className="font-semibold text-glow-600">~₦{style.estimated_cost_ngn?.toLocaleString()}</span><span className="text-gray-500">•</span><span className="text-gray-600">{style.where_to_get}</span></div>
                </div>
              ))}
            </div>
            {result.budget_optimization && <div className="mt-6 rounded-2xl bg-green-50 p-4 text-sm text-green-800"><span className="font-semibold">Budget Tip: </span>{result.budget_optimization}</div>}
          </div>
          <button onClick={clear} className="btn-secondary w-full">Try Another Look</button>
        </div>
      )}
    </div>
  )
}
