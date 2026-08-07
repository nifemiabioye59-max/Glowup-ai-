'use client'

import { useState, useEffect } from 'react'
import { Sparkles, TrendingUp, Flame, Droplets, Scale, User } from 'lucide-react'

export default function DashboardPage() {
  const [scansUsed, setScansUsed] = useState(0)
  const [subscribed, setSubscribed] = useState(false)
  const [analysis, setAnalysis] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setScansUsed(Number(localStorage.getItem('scansUsed') || '0'))
    setSubscribed(localStorage.getItem('subscribed') === 'true')
  }, [])

  const runAnalysis = () => {
    if (!subscribed && scansUsed >= 3) {
      alert('Free scans used! Subscribe to Premium for unlimited AI analysis.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setAnalysis(`Based on your profile:
      
Skin Tone: Medium-dark. Recommended: Vitamin C serum daily, SPF 50 sunscreen.

Hair Type: 4C coily. Recommended: Deep condition weekly, protective styles.

Body Goals: Weight management. Recommended: 3-month fitness plan, reduce sugar intake.

Health: Monitor sugar levels. Recommended foods: Oats, vegetables, lean protein.

Daily routine: Drink 3L water, sleep 8 hours, exercise 30 min daily.`)
      
      const newScans = scansUsed + 1
      setScansUsed(newScans)
      localStorage.setItem('scansUsed', String(newScans))
      setLoading(false)
    }, 2000)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pink-600 mb-2 flex items-center justify-center gap-2">
          <Sparkles size={32} /> AI Analysis Dashboard
        </h1>
        <p className="text-gray-600">Get personalized beauty, fitness & health recommendations</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: TrendingUp, label: 'Workouts', value: '12', color: 'text-orange-500' },
          { icon: Flame, label: 'Calories Burned', value: '3,450', color: 'text-red-500' },
          { icon: Droplets, label: 'Water (L)', value: '2.5', color: 'text-blue-500' },
          { icon: Scale, label: 'Weight (kg)', value: '65', color: 'text-green-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 text-center border border-pink-100">
            <stat.icon size={24} className={`mx-auto mb-2 ${stat.color}`} />
            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-pink-100 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Sparkles size={20} className="text-pink-500" /> AI Health Analysis
          </h3>
          <span className="text-sm text-gray-500">{3 - scansUsed} free scans left</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-gray-600 block mb-1">Skin Tone</label>
            <select className="w-full p-3 border rounded-xl text-sm">
              <option>Dark</option>
              <option>Medium-Dark</option>
              <option>Medium</option>
              <option>Light</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Hair Type</label>
            <select className="w-full p-3 border rounded-xl text-sm">
              <option>4C - Coily</option>
              <option>4B - Kinky</option>
              <option>3C - Curly</option>
              <option>2A - Wavy</option>
              <option>Straight</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Body Goal</label>
            <select className="w-full p-3 border rounded-xl text-sm">
              <option>Weight Loss</option>
              <option>Weight Gain</option>
              <option>Muscle Tone</option>
              <option>Flat Tummy</option>
              <option>Big Butt</option>
              <option>General Fitness</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-600 block mb-1">Health Issues</label>
            <select className="w-full p-3 border rounded-xl text-sm">
              <option>None</option>
              <option>Ulcer</option>
              <option>Diabetes</option>
              <option>High BP</option>
              <option>Chest Pain</option>
            </select>
          </div>
        </div>

        <button
          onClick={runAnalysis}
          disabled={loading}
          className="w-full pink-gradient text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Run AI Analysis'}
        </button>

        {analysis && (
          <div className="mt-4 bg-pink-50 rounded-xl p-4 whitespace-pre-line text-sm text-gray-700">
            {analysis}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl p-6 border border-pink-100">
        <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
          <User size={20} className="text-pink-500" /> Speak with a Dietician
        </h3>
        <p className="text-sm text-gray-600 mb-4">Get personalized meal plans from certified nutritionists</p>
        <button className="w-full border-2 border-pink-200 text-pink-600 py-3 rounded-xl font-semibold hover:bg-pink-50">
          Book a Consultation - ₦10,000
        </button>
      </div>
    </main>
  )
}
