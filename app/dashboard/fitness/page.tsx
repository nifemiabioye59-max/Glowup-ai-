'use client'
import { useState } from 'react'
import { Dumbbell, Target, Flame, Clock, CheckCircle } from 'lucide-react'

const GOALS = [
  { id: 'weight-loss', label: 'Weight Loss', icon: Flame, color: 'bg-orange-100 text-orange-700' },
  { id: 'tone-up', label: 'Tone Up', icon: Target, color: 'bg-glow-100 text-glow-700' },
  { id: 'build-muscle', label: 'Build Muscle', icon: Dumbbell, color: 'bg-lavender-100 text-lavender-700' },
  { id: 'flexibility', label: 'Flexibility', icon: Clock, color: 'bg-emerald-100 text-emerald-700' },
]

const WORKOUTS: Record<string, any[]> = {
  'weight-loss': [
    { day: 'Day 1', title: 'Cardio Blast', exercises: ['Jumping jacks — 3 min', 'High knees — 3 min', 'Burpees — 10 reps x 3', 'Mountain climbers — 30 sec x 3'], duration: '30 min' },
    { day: 'Day 2', title: 'Full Body Burn', exercises: ['Squats — 15 reps x 3', 'Lunges — 12 each leg x 3', 'Push-ups — 10 reps x 3', 'Plank — 45 sec x 3'], duration: '35 min' },
    { day: 'Day 3', title: 'Active Rest', exercises: ['Light walk — 20 min', 'Stretching — 10 min'], duration: '30 min' },
  ],
  'tone-up': [
    { day: 'Day 1', title: 'Core & Abs', exercises: ['Crunches — 20 reps x 3', 'Leg raises — 15 reps x 3', 'Russian twists — 20 reps x 3', 'Plank — 1 min x 3'], duration: '25 min' },
    { day: 'Day 2', title: 'Lower Body', exercises: ['Squats — 20 reps x 3', 'Glute bridges — 15 reps x 3', 'Calf raises — 20 reps x 3', 'Wall sit — 45 sec x 3'], duration: '30 min' },
    { day: 'Day 3', title: 'Upper Body', exercises: ['Push-ups — 12 reps x 3', 'Tricep dips — 12 reps x 3', 'Arm circles — 1 min x 2', 'Plank shoulder taps — 10 reps x 3'], duration: '25 min' },
  ],
  'build-muscle': [
    { day: 'Day 1', title: 'Leg Day', exercises: ['Squats — 15 reps x 4', 'Lunges — 12 each x 4', 'Deadlifts (light) — 10 reps x 4', 'Calf raises — 20 reps x 3'], duration: '45 min' },
    { day: 'Day 2', title: 'Push Day', exercises: ['Push-ups — 15 reps x 4', 'Shoulder press — 12 reps x 3', 'Tricep dips — 15 reps x 3'], duration: '40 min' },
    { day: 'Day 3', title: 'Pull Day', exercises: ['Rows — 12 reps x 4', 'Bicep curls — 15 reps x 3', 'Back extensions — 12 reps x 3'], duration: '40 min' },
  ],
  'flexibility': [
    { day: 'Day 1', title: 'Yoga Flow', exercises: ['Sun salutation — 5 rounds', 'Downward dog — 1 min', 'Warrior poses — 30 sec each', 'Child pose — 2 min'], duration: '30 min' },
    { day: 'Day 2', title: 'Stretching', exercises: ['Hamstring stretch — 30 sec each', 'Hip flexor stretch — 30 sec each', 'Shoulder stretch — 30 sec each', 'Spinal twist — 1 min each side'], duration: '25 min' },
    { day: 'Day 3', title: 'Pilates', exercises: ['Hundred — 100 pumps', 'Roll-up — 10 reps', 'Single leg stretch — 10 each', 'Swimming — 30 sec'], duration: '30 min' },
  ],
}

export default function FitnessPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null)
  const [completed, setCompleted] = useState<Set<string>>(new Set())

  const toggleComplete = (key: string) => {
    setCompleted(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div><h1 className="text-2xl font-bold text-gray-900">Fitness Plans</h1><p className="mt-1 text-gray-600">Choose your goal and get a personalized workout plan</p></div>

      {!selectedGoal ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {GOALS.map(goal => (
            <button key={goal.id} onClick={() => setSelectedGoal(goal.id)} className="card text-left hover:shadow-xl transition-shadow">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${goal.color} mb-4`}><goal.icon className="h-6 w-6" /></div>
              <h3 className="text-lg font-semibold text-gray-900">{goal.label}</h3>
              <p className="text-sm text-gray-500 mt-1">Tap to see your plan</p>
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          <button onClick={() => setSelectedGoal(null)} className="text-sm text-glow-600 font-medium">← Back to goals</button>
          <h2 className="text-xl font-bold text-gray-900">{GOALS.find(g => g.id === selectedGoal)?.label} Plan</h2>
          <div className="space-y-4">
            {WORKOUTS[selectedGoal]?.map((workout, idx) => (
              <div key={idx} className="card">
                <div className="flex items-center justify-between mb-3">
                  <div><span className="text-xs font-semibold text-glow-600 uppercase tracking-wider">{workout.day}</span><h3 className="text-lg font-semibold text-gray-900">{workout.title}</h3></div>
                  <div className="flex items-center gap-1 text-sm text-gray-500"><Clock className="h-4 w-4" />{workout.duration}</div>
                </div>
                <ul className="space-y-2">
                  {workout.exercises.map((ex: string, i: number) => {
                    const key = `${selectedGoal}-${idx}-${i}`
                    return (
                      <li key={i} className="flex items-center gap-3">
                        <button onClick={() => toggleComplete(key)} className="shrink-0">
                          <CheckCircle className={`h-5 w-5 ${completed.has(key) ? 'text-green-500 fill-green-500' : 'text-gray-300'}`} />
                        </button>
                        <span className={`text-sm ${completed.has(key) ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{ex}</span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
