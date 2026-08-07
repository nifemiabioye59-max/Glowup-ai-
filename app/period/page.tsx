'use client'

import { useState, useEffect } from 'react'
import { Heart, Calendar, Bell, AlertCircle, Lock, CheckCircle } from 'lucide-react'

export default function PeriodPage() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [painLevel, setPainLevel] = useState(5)
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [sawDoctor, setSawDoctor] = useState(false)
  const [reminders, setReminders] = useState(true)
  const [cycles, setCycles] = useState<any[]>([])
  const [showPayment, setShowPayment] = useState(false)
  const [freeUses, setFreeUses] = useState(0)
  const [subscribed, setSubscribed] = useState(false)

  useEffect(() => {
    setCycles(JSON.parse(localStorage.getItem('periodCycles') || '[]'))
    setFreeUses(Number(localStorage.getItem('periodFreeUses') || '0'))
    setSubscribed(localStorage.getItem('subscribed') === 'true')
  }, [])

  const saveCycle = () => {
    if (!subscribed && freeUses >= 3) {
      setShowPayment(true)
      return
    }
    const newCycle = { startDate, endDate, painLevel, symptoms, sawDoctor, date: new Date().toISOString() }
    const updated = [...cycles, newCycle]
    setCycles(updated)
    localStorage.setItem('periodCycles', JSON.stringify(updated))
    
    const newFree = freeUses + 1
    setFreeUses(newFree)
    localStorage.setItem('periodFreeUses', String(newFree))
    
    alert('Cycle saved! Reminders set.')
  }

  const nextPeriod = cycles.length > 0
    ? new Date(new Date(cycles[cycles.length - 1].startDate).getTime() + 28 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    : ''

  if (!subscribed && freeUses >= 3) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-12 text-center">
        <Lock size={64} className="mx-auto text-pink-300 mb-6" />
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Free Period Tracking Ended</h2>
        <p className="text-gray-600 mb-8">You've used 3 free period tracking sessions. Subscribe to Premium for unlimited tracking & reminders!</p>
        <button className="pink-gradient text-white px-8 py-3 rounded-full font-semibold">
          Upgrade to Premium - ₦3,000/month
        </button>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <Heart size={32} /> Period Tracker
        </h1>
        <p className="text-gray-600">Track your cycle, get reminders & health insights</p>
      </div>

      <div className="bg-white rounded-2xl p-6 mb-6 border border-pink-100">
        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calendar size={20} className="text-pink-500" /> Log Your Cycle
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Period Start Date</label>
            <input
              type="date"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Period End Date</label>
            <input
              type="date"
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-pink-500 outline-none"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Pain Level: {painLevel}/10</label>
          <input
            type="range"
            min="1"
            max="10"
            value={painLevel}
            onChange={e => setPainLevel(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>No Pain</span>
            <span>Moderate</span>
            <span>Severe</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Symptoms</label>
          <div className="flex flex-wrap gap-2">
            {['Cramps', 'Bloating', 'Headache', 'Mood Swings', 'Fatigue', 'Back Pain', 'Nausea', 'Acne'].map((s: string) => (
              <button
                key={s}
                onClick={() => setSymptoms((prev: string[]) => prev.includes(s) ? prev.filter((x: string) => x !== s) : [...prev, s])}
                className={`px-3 py-2 rounded-full text-sm font-medium transition ${
                  symptoms.includes(s) ? 'pink-gradient text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={sawDoctor}
              onChange={e => setSawDoctor(e.target.checked)}
              className="w-4 h-4 accent-pink-500"
            />
            Have you seen a doctor this cycle?
          </label>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={reminders}
              onChange={e => setReminders(e.target.checked)}
              className="w-4 h-4 accent-pink-500"
            />
            Enable daily reminders
          </label>
        </div>

        <button
          onClick={saveCycle}
          className="w-full pink-gradient text-white py-3 rounded-xl font-semibold hover:opacity-90"
        >
          Save Cycle & Set Reminders
        </button>
      </div>

      {nextPeriod && (
        <div className="bg-pink-50 rounded-2xl p-6 mb-6 border border-pink-200">
          <h3 className="font-bold text-pink-700 mb-2 flex items-center gap-2">
            <Bell size={18} /> Next Period Prediction
          </h3>
          <p className="text-2xl font-bold text-pink-600">{nextPeriod}</p>
          <p className="text-sm text-gray-600 mt-1">Based on your 28-day cycle average</p>
        </div>
      )}

      {cycles.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-pink-100">
          <h3 className="font-bold text-gray-800 mb-4">Cycle History</h3>
          <div className="space-y-3">
            {cycles.map((c: any, i: number) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="font-medium text-gray-800 text-sm">{c.startDate} to {c.endDate}</p>
                  <p className="text-xs text-gray-500">Pain: {c.painLevel}/10 • {c.symptoms.join(', ')}</p>
                </div>
                {c.sawDoctor && <CheckCircle size={18} className="text-green-500" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
                  }
      
