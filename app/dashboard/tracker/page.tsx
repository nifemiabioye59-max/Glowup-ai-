'use client'
import { useState } from 'react'
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addDays, differenceInDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns'

export default function TrackerPage() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState(28)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    if (!lastPeriod) return
    setSaved(true)
  }

  const lastDate = lastPeriod ? new Date(lastPeriod) : null
  const nextPeriod = lastDate ? addDays(lastDate, cycleLength) : null
  const fertileStart = lastDate ? addDays(lastDate, cycleLength - 14) : null
  const fertileEnd = lastDate ? addDays(lastDate, cycleLength - 10) : null
  const today = new Date()
  const currentMonth = startOfMonth(today)
  const days = eachDayOfInterval({ start: currentMonth, end: endOfMonth(today) })

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Period Tracker</h1><p className="mt-1 text-gray-600">Track your cycle and predict your next period</p></div>

      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Calendar className="h-5 w-5 text-glow-500" /> Cycle Info</h2>
        <div className="space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">First day of last period</label><input type="date" value={lastPeriod} onChange={e => { setLastPeriod(e.target.value); setSaved(false) }} className="input-glow" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1.5">Average cycle length (days)</label><input type="number" value={cycleLength} onChange={e => { setCycleLength(parseInt(e.target.value) || 28); setSaved(false) }} min={21} max={35} className="input-glow" /></div>
          <button onClick={handleSave} className="btn-primary">Save & Predict</button>
        </div>
      </div>

      {saved && nextPeriod && (
        <div className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-glow-50 p-6 text-center"><p className="text-sm text-glow-600 font-medium uppercase tracking-wider">Next Period</p><p className="text-xl font-bold text-gray-900 mt-1">{format(nextPeriod, 'MMM d')}</p><p className="text-xs text-gray-500 mt-1">{differenceInDays(nextPeriod, today) > 0 ? `in ${differenceInDays(nextPeriod, today)} days` : 'soon'}</p></div>
            <div className="rounded-2xl bg-lavender-50 p-6 text-center"><p className="text-sm text-lavender-600 font-medium uppercase tracking-wider">Fertile Window</p><p className="text-xl font-bold text-gray-900 mt-1">{format(fertileStart!, 'MMM d')} - {format(fertileEnd!, 'MMM d')}</p></div>
            <div className="rounded-2xl bg-rose-50 p-6 text-center"><p className="text-sm text-rose-600 font-medium uppercase tracking-wider">Ovulation</p><p className="text-xl font-bold text-gray-900 mt-1">{format(addDays(lastDate!, cycleLength - 14), 'MMM d')}</p></div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{format(currentMonth, 'MMMM yyyy')}</h3>
              <div className="flex gap-1"><ChevronLeft className="h-5 w-5 text-gray-400" /><ChevronRight className="h-5 w-5 text-gray-400" /></div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
              {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: getDay(currentMonth) }).map((_, i) => <div key={`empty-${i}`} />)}
              {days.map(day => {
                const isPeriod = lastDate && isSameDay(day, lastDate)
                const isNext = nextPeriod && isSameDay(day, nextPeriod)
                const isFertile = fertileStart && fertileEnd && day >= fertileStart && day <= fertileEnd
                return (
                  <div key={day.toISOString()} className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium ${isPeriod ? 'bg-glow-500 text-white' : isNext ? 'bg-glow-200 text-glow-800' : isFertile ? 'bg-lavender-100 text-lavender-700' : 'text-gray-700 hover:bg-gray-50'}`}>
                    {format(day, 'd')}
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs">
              <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full bg-glow-500" /><span>Last Period</span></div>
              <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full bg-glow-200" /><span>Next Period</span></div>
              <div className="flex items-center gap-1"><div className="h-3 w-3 rounded-full bg-lavender-100" /><span>Fertile</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
