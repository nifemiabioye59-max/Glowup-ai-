'use client'
import { useState, useCallback } from 'react'
import { Camera, Loader2, Sparkles, X, Apple } from 'lucide-react'

export default function FoodScanPage() {
  const [image, setImage] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
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
      const res = await fetch('/api/scan/food', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) { setError(data.upgrade ? 'Free limit reached. Upgrade for food scanner.' : data.error); return }
      setResult(data.analysis)
    } catch (err: any) { setError(err.message || 'Failed') }
    finally { setAnalyzing(false) }
  }

  const clear = () => { setImage(null); setFile(null); setResult(null); setError('') }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Food Scanner</h1><p className="mt-1 text-gray-600">Snap your meal and get nutrition insights</p></div>
      {!image ? (
        <label className="group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/50 p-12 hover:border-amber-400 hover:bg-amber-50 cursor-pointer transition-colors">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform"><Camera className="h-8 w-8 text-amber-500" /></div>
          <p className="text-sm font-medium text-gray-900">Upload a photo of your meal</p>
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
        <button onClick={handleAnalyze} disabled={analyzing} className="w-full rounded-xl bg-amber-500 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2">
          {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing...</> : <><Sparkles className="h-4 w-4" /> Analyze Meal</>}
        </button>
      )}
      {result && (
        <div className="space-y-6">
          <div className="card border-amber-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2"><Apple className="h-5 w-5 text-amber-500" /> Nutrition Analysis</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl bg-amber-50 p-6"><p className="text-sm text-amber-600 font-medium uppercase tracking-wider">Food</p><p className="text-xl font-bold text-gray-900 mt-1">{result.food_name}</p></div>
              <div className="rounded-2xl bg-green-50 p-6"><p className="text-sm text-green-600 font-medium uppercase tracking-wider">Calories</p><p className="text-xl font-bold text-gray-900 mt-1">{result.calories} kcal</p></div>
            </div>
            {result.macros && (
              <div className="mb-6"><h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Macros</h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-blue-50 p-4 text-center"><p className="text-xs text-blue-600 font-medium">Protein</p><p className="text-lg font-bold text-gray-900">{result.macros.protein}</p></div>
                  <div className="rounded-xl bg-orange-50 p-4 text-center"><p className="text-xs text-orange-600 font-medium">Carbs</p><p className="text-lg font-bold text-gray-900">{result.macros.carbs}</p></div>
                  <div className="rounded-xl bg-yellow-50 p-4 text-center"><p className="text-xs text-yellow-600 font-medium">Fat</p><p className="text-lg font-bold text-gray-900">{result.macros.fat}</p></div>
                </div>
              </div>
            )}
            <div className="rounded-2xl bg-gray-50 p-4 mb-4"><p className="text-sm font-medium text-gray-900 mb-1">Health Rating</p><p className={`text-lg font-bold ${result.health_rating === 'good' ? 'text-green-600' : result.health_rating === 'moderate' ? 'text-amber-600' : 'text-red-600'}`}>{result.health_rating?.toUpperCase()}</p></div>
            {result.healthier_swap && <div className="rounded-2xl bg-green-50 p-4 text-sm text-green-800"><span className="font-semibold">Healthier Swap: </span>{result.healthier_swap}</div>}
            {result.tips && <div className="mt-4 text-sm text-gray-600"><span className="font-semibold">Tips: </span>{result.tips}</div>}
          </div>
          <button onClick={clear} className="btn-secondary w-full">Scan Another Meal</button>
        </div>
      )}
    </div>
  )
}
